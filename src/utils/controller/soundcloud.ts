import axios from 'axios';

import Song from '@models/song';
import Playlist from '@models/playlist';
import BotError, { ErrorType } from '@models/errors';
import { getter, searcher } from '@models/platform';
import { SearchResult, Track, Set } from '@models/soundcloud';

import Cache from '@utils/cache';

import { CACHE_TIMEOUT, SOUNDCLOUD_TOKEN } from '@src/config';

const request = axios.create({
	baseURL: 'https://api-v2.soundcloud.com/',
	params: { client_id: SOUNDCLOUD_TOKEN },
	method: 'GET',
});

type CachedSong = Song & { expires: number };
type CachedPlaylist = Playlist & { expires: number };

export const track: getter = async (url) => {
	const cached = await Cache.get<CachedSong>(url);

	if (cached && cached.expires > Date.now()) {
		return cachedToSong(cached);
	}

	return await request('/resolve', {
		params: { url },
	})
		.then(async ({ data: track }: { data: Track }) => {
			const song = await trackToSong(track);

			await Cache.set<CachedSong>(url, { ...song, expires: Date.now() + CACHE_TIMEOUT });

			return song;
		})
		.catch(() => {
			throw new BotError(ErrorType.NotFound);
		});
};

export const search: searcher = async (keywords, limit) => {
	return await request('/search/tracks', {
		params: { q: keywords.join(' '), limit },
	}).then(({ data }: { data: SearchResult }) => data.collection.map(trackToSong));
};

export const playlist: getter = async (url) => {
	const cached = await Cache.get<CachedPlaylist>(url);

	if (cached && cached.expires > Date.now()) {
		cached.songs = cached.songs.map(cachedToSong);

		return { ...cached, released: new Date(cached.created) };
	}

	return await request('/resolve', {
		params: { url },
	}).then(async ({ data: playlist }: { data: Set }) => {
		const songs = playlist.tracks.map(trackToSong);

		const list: Playlist = {
			isPlaylist: () => true,
			isSong: () => false,
			artwork: playlist.artwork_url,
			created: new Date(playlist.created_at),
			name: playlist.title,
			platform: 'soundcloud',
			total_length: playlist.duration / 1000,
			url,
			songs,
			count: playlist.track_count,
			user: {
				avatar: playlist.user.avatar_url,
				name: playlist.user.username,
			},
		};

		await Cache.set<CachedPlaylist>(url, { ...list, expires: Date.now() + CACHE_TIMEOUT });

		return list;
	});
};

export const testToken = async (): Promise<boolean> => {
	const { status } = await request('/', {
		validateStatus: () => true,
	});

	return status == 404;
};

const trackToSong = (track: Track): Song => {
	const artist = track.publisher_metadata?.artist ?? track.user.username;

	const getStreamURL = track.media.transcodings.find(
		(transcoding) =>
			transcoding.format.protocol == 'hls' &&
			transcoding.format.mime_type == 'audio/ogg; codecs="opus"'
	);

	if (!getStreamURL) throw new BotError(ErrorType.NotFound);

	const streamURL = () =>
		axios
			.get<{ url: string }>(getStreamURL.url, { params: { client_id: SOUNDCLOUD_TOKEN } })
			.then(({ data }) => data?.url);

	const song: Song = {
		isPlaylist: () => false,
		isSong: () => true,
		artwork: track.artwork_url ?? '',
		artists: [artist],
		length: track.full_duration / 1000,
		name: track.title,
		platform: 'soundcloud',
		released: new Date(track.release_date ?? track.display_date),
		streamURL,
		url: track.permalink_url,
	};

	return song;
};

const cachedToSong = (cached: Song) => ({
	...cached,
	released: new Date(cached.released),
	isPlaylist: () => false,
	isSong: () => true,
});
