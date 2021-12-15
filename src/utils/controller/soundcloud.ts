import BotError, { ErrorType } from '@models/errors';
import { CACHE_TIMEOUT, SOUNDCLOUD_TOKEN } from '@src/config';
import { SearchResult, Track } from '@models/soundcloud';
import { getter, searcher } from '@models/platform';

import Cache from '@utils/cache';
import Song from '@models/song';
import axios from 'axios';

const request = axios.create({
	baseURL: 'https://api-v2.soundcloud.com/',
	params: { client_id: SOUNDCLOUD_TOKEN },
	method: 'GET',
});

type CachedSong = Song & { expires: number };

export const track: getter = async (url) => {
	const cached = await Cache.get<CachedSong>(url);

	if (cached && cached.expires > Date.now()) {
		return { ...cached, released: new Date(cached.released) };
	}

	return await request('/resolve', {
		params: { url },
	}).then(async ({ data: track }: { data: Track }) => {
		const song = await trackToSong(track);

		await Cache.set<CachedSong>(url, { ...song, expires: Date.now() + CACHE_TIMEOUT });

		return song;
	});
};

export const search: searcher = async (keywords, limit) => {
	return await request('/search/tracks', {
		params: { q: keywords.join(' '), limit },
	}).then(({ data }: { data: SearchResult }) =>
		Promise.all(data.collection.map(async (result) => await trackToSong(result)))
	);
};

export const testToken = async (): Promise<boolean> => {
	const { status } = await request('/', {
		validateStatus: () => true,
	});

	return status == 404;
};

const trackToSong = async (track: Track): Promise<Song> => {
	const artist = track.publisher_metadata?.artist ?? track.user.username;

	const getStreamURL = track.media.transcodings.find(
		(transcoding) =>
			transcoding.format.protocol == 'hls' &&
			transcoding.format.mime_type == 'audio/ogg; codecs="opus"'
	);

	if (!getStreamURL) throw new BotError('Could not find soundcloud song', ErrorType.NotFound);

	const streamURL = await axios
		.get<{ url: string }>(getStreamURL.url, { params: { client_id: SOUNDCLOUD_TOKEN } })
		.then(({ data }) => data?.url);

	const song: Song = {
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
