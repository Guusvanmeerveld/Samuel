import cheerio from 'cheerio';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import BotError from '@models/errors';
import { getter, searcher } from '@models/platform';
import Playlist from '@models/playlist';
import Song, { Platform, UnresolvedSong } from '@models/song';
import { SearchResult, Set, Track } from '@models/soundcloud';

import * as cache from '@utils/cache';

import * as Logger from '@global/utils/logger';

import { SOUNDCLOUD_TOKEN } from '@src/config';
import { SOUNDCLOUD_CLIENT_ID_REGEX } from '@src/config/constants.config';
import lang from '@src/lang';

type CachedSong = Song & { expires: number };

//			 S	   	M	 H	  D	   W
const WEEK = 1000 * 60 * 60 * 24 * 7;

const playable = { isPlaylist: () => false, isSong: () => true };
const platform: Platform = 'soundcloud';

const request = (url: string, options: AxiosRequestConfig & { client_id: string }) =>
	axios.get(`https://api-v2.soundcloud.com${url}`, {
		...options,
		params: { ...options.params, client_id: options.client_id },
	});

export const track: getter = async (url) => createSong({ url });

export const search: searcher = async (keywords, limit) => {
	return await request('/search/tracks', {
		client_id: await fetchToken(),
		params: {
			q: keywords.join(' '),
			limit,
		},
	})
		.then(({ data }: { data: SearchResult }) =>
			data.collection.map((song) => createSong({ url: song.permalink_url, track: song }))
		)
		.catch((error) => console.log(error));
};

export const playlist: getter = async (url) => {
	return await request('/resolve', {
		client_id: await fetchToken(),
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

export const fetchToken = async (): Promise<string> => {
	if (SOUNDCLOUD_TOKEN) return SOUNDCLOUD_TOKEN;

	const cached = await cache.get<string | null>('soundcloudToken');

	if (cached) {
		return cached;
	}

	Logger.log(lang.checks.soundcloud.fetching.status);

	const page = await axios.get('https://soundcloud.com/');

	const $ = cheerio.load(page.data);

	const script = $('script[src*="/3-"]');

	const scriptURL = script.attr('src');

	if (!scriptURL) {
		throw new BotError(lang.checks.soundcloud.fetching.failed);
	}

	const { data: scriptContents } = await axios.get<string>(scriptURL);

	const match = scriptContents.match(SOUNDCLOUD_CLIENT_ID_REGEX);

	if (!match || (match && !match[1])) {
		throw new BotError(lang.checks.soundcloud.fetching.failed);
	}

	const token = match[1];

	await cache.set('soundcloudToken', token, WEEK);

	Logger.log(lang.checks.soundcloud.fetching.success);

	return token;
};

export const testToken = async (token: string): Promise<boolean> => {
	const { status } = await request('/', {
		client_id: token,
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
			const cached = await cache.get<CachedSong | null>(url!);

			let result: Song | undefined;

			if (cached) {
				result = { ...cached, released: new Date(cached.released) };
			}

			if (!track?.title)
				track! = await request('/resolve', {
					client_id: await fetchToken(),
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
				.get<{ url: string }>(getStreamURL.url, { params: { client_id: await fetchToken() } })
				.then(({ data }) => data?.url);

			if (!result) {
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
				});
			}

			return result;
		},
		platform,
		identifier: url ?? id?.toString() ?? '',
	};

	return song;
};
