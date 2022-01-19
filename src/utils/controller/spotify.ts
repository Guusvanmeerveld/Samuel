import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import BotError from '@models/errors';
import { getter, searcher } from '@models/platform';
import Song, { Platform, UnresolvedSong } from '@models/song';
import { SearchResult, Track } from '@models/spotify';

import * as cache from '@utils/cache';

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@src/config';
import lang from '@src/lang';

const CREDENTIALS = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

const platform: Platform = 'spotify';
const playable = { isPlaylist: () => false, isSong: () => true };

const request = async <T>(
	url: string,
	{ token, method, params }: AxiosRequestConfig & { token: string }
): Promise<AxiosResponse<T>> =>
	await axios(`https://api.spotify.com/v1${url}`, {
		headers: { Authorization: `Bearer ${token}` },
		method,
		params,
	});

const fetchToken = async (): Promise<string> => {
	const cached = await cache.get<string | null>('spotifyToken');

	if (cached) {
		return cached;
	}

	const { data, status } = await axios('https://accounts.spotify.com/api/token', {
		headers: {
			Authorization: `Basic ${CREDENTIALS}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		params: { grant_type: 'client_credentials' },
		method: 'POST',
		validateStatus: () => true,
	});

	if (status == 200) {
		await cache.set('spotifyToken', data.access_token, data.expires_in * 1000);

		return data.access_token;
	}

	throw new BotError('Failed to fetch Spotify token');
};

export const get: getter = async (url) => urlToSong({ url });

export const search: searcher = async (keywords, limit) => {
	const res = await request<SearchResult>('/search', {
		token: await fetchToken(),
		method: 'GET',
		params: { type: 'track', q: keywords.join(' '), limit: limit.toString() },
	}).catch(() => false);

	if (!res || typeof res == 'boolean') {
		throw new BotError(lang.song.notFound);
	}

	const songs = res.data.tracks.items.map((track: Track) => urlToSong({ track }));

	return songs;
};

const urlToSong = ({
	track,
	id,
	url,
}: {
	track?: Track;
	id?: string;
	url?: string;
}): UnresolvedSong => {
	if (url && !id && !track) {
		const uri = new URL(url);
		const split = uri.href.split('/');

		id = split[split.length - 1].split('?')[0];
	}

	if (!id) {
		id = track?.id;
	}

	const song: UnresolvedSong = {
		resolve: async () => {
			const cached = await cache.get<Song>(id!);

			if (cached) {
				return { ...cached, ...playable };
			}

			if (!track?.name) {
				const { data } = await request<Track>(`/tracks/${id}/`, {
					token: await fetchToken(),
					method: 'GET',
					validateStatus: () => true,
				});
				track = data;
			}

			const song: Song = {
				...playable,
				artists: track.artists.map((artist) => artist.name),
				artwork: track.album.images[0].url,
				length: track.duration_ms / 1000,
				name: track.name,
				platform,
				released: new Date(track.album.release_date),
				url: track.external_urls.spotify,
				streamURL: '',
			};

			await cache.set(id!, song);

			return song;
		},
		isPlaylist: () => false,
		isSong: () => true,
		platform,
		identifier: track?.href ?? id ?? '',
	};

	return song;
};
