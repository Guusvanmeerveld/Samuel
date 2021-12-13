import axios from 'axios';

import BotError, { ErrorType } from '@models/errors';
import { Track } from '@models/soundcloud';
import { getter } from '@models/platform';
import Song from '@models/song';

import Cache from '@utils/cache';

import { CACHE_TIMEOUT, SOUNDCLOUD_TOKEN } from '@src/config';

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
	}).then(async ({ data }: { data: Track }) => {
		const artist = data.publisher_metadata?.artist ?? data.user.username;

		const getStreamURL = data.media.transcodings.find(
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
			length: data.full_duration / 1000,
			name: data.title,
			platform: 'soundcloud',
			released: new Date(data.release_date ?? data.display_date),
			streamURL,
			url: data.permalink_url,
		};

		await Cache.set<CachedSong>(url, { ...song, expires: Date.now() + CACHE_TIMEOUT });

		return song;
	});
};

export const testToken = async (): Promise<boolean> => {
	const { status } = await request('/', {
		validateStatus: () => true,
	});

	return status == 404;
};
