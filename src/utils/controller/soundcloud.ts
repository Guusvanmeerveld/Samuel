import axios, { AxiosResponse } from 'axios';

import BotError from '@models/errors';
import { getter, searcher } from '@models/platform';
import Playlist from '@models/playlist';
import Song, { Platform, UnresolvedSong } from '@models/song';
import { SearchResult, Set, Track } from '@models/soundcloud';

import Cache from '@utils/cache';

import { CACHE_TIMEOUT, SOUNDCLOUD_TOKEN } from '@src/config';
import lang from '@src/lang';

type CachedSong = Song & { expires: number };

const playable = { isPlaylist: () => false, isSong: () => true };
const platform: Platform = 'soundcloud';

const cache = new Cache<CachedSong>('songs');

const request = axios.create({
	baseURL: 'https://api-v2.soundcloud.com/',
	params: { client_id: SOUNDCLOUD_TOKEN },
	method: 'GET',
});

export const track: getter = async (url) => createSong({ url });

export const search: searcher = async (keywords, limit) => {
	return await request('/search/tracks', {
		params: { q: keywords.join(' '), limit },
	}).then(({ data }: { data: SearchResult }) =>
		data.collection.map((song) => createSong({ url: song.permalink_url, track: song }))
	);
};

export const playlist: getter = async (url) => {
	return await request('/resolve', {
		params: { url },
	}).then(async ({ data: playlist }: { data: Set }) => {
		const songs = playlist.tracks.map((track) => createSong({ track, id: track.id }));

		const list: Playlist = {
			isPlaylist: () => true,
			isSong: () => false,
			artwork: playlist.artwork_url,
			created: new Date(playlist.created_at),
			name: playlist.title,
			platform,
			total_length: playlist.duration / 1000,
			url,
			songs,
			count: playlist.track_count,
			user: {
				avatar: playlist.user.avatar_url,
				name: playlist.user.username,
			},
		};

		return list;
	});
};

export const testToken = async (): Promise<boolean> => {
	const { status } = await request('/', {
		validateStatus: () => true,
	});

	return status == 404;
};

const createSong = ({
	url,
	id,
	track,
}: {
	url?: string;
	id?: number;
	track?: Track;
}): UnresolvedSong => {
	const song: UnresolvedSong = {
		...playable,
		resolve: async () => {
			if (!cache.initialized()) {
				await cache.init();
			}

			const cached = await cache.get(url!);

			let result: Song | undefined;

			if (cached && cached.expires > Date.now()) {
				console.log('cached');

				result = { ...cached, released: new Date(cached.released) };
			}

			if (!track?.title) console.log('Request sent');

			if (!track?.title)
				track! = await request('/resolve', {
					params: { url, id },
				})
					.catch(() => {
						throw new BotError(lang.song.notFound);
					})
					.then((res: AxiosResponse<Track>) => res.data);

			const artist = track.publisher_metadata?.artist ?? track.user.username;

			const getStreamURL = track.media.transcodings.find(
				(transcoding) =>
					transcoding.format.protocol == 'hls' &&
					transcoding.format.mime_type == 'audio/ogg; codecs="opus"'
			);

			if (!getStreamURL) throw new BotError(lang.song.notFound);

			url = track.permalink_url;
			const name = track.title;

			const streamURL = await axios
				.get<{ url: string }>(getStreamURL.url, { params: { client_id: SOUNDCLOUD_TOKEN } })
				.then(({ data }) => data?.url);

			if (!result) {
				console.log('not cached');

				result = {
					...playable,
					artwork: track.artwork_url ?? '',
					artists: [artist],
					length: track.full_duration / 1000,
					name,
					platform,
					released: new Date(track.release_date ?? track.display_date),
					streams: track.playback_count,
					likes: track.likes_count,
					streamURL,
					url,
				};

				await cache.set(url, {
					...result,

					expires: Date.now() + CACHE_TIMEOUT,
				});
			}

			return result;
		},
		platform,
		identifier: url ?? id?.toString() ?? '',
	};

	return song;
};
