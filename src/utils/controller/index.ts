import * as file from './file';
import * as soundcloud from './soundcloud';
import * as spotify from './spotify';

import BotError from '@models/errors';
import { getter, searcher } from '@models/platform';
import Playlist from '@models/playlist';
import { UnresolvedSong } from '@models/song';

import {
	AUDIO_FILE_EXTENSIONS,
	SEARCH_RESULT_LIMIT,
	SOUNDCLOUD_REGEX,
	SOUNDCLOUD_SETS_REGEX,
	SPOTIFY_REGEX,
} from '@src/config/constants.config';
import lang from '@src/lang';

export const search = async (
	keywords: string[],
	limit = SEARCH_RESULT_LIMIT,
	platform = 'soundcloud'
): Promise<UnresolvedSong[] | void> => {
	let searcher: searcher | undefined;

	if (platform == 'soundcloud') {
		searcher = soundcloud.search;
	}

	if (platform == 'spotify') {
		searcher = spotify.search;
	}

	if (!searcher) throw new BotError(lang.song.notFound);

	const result = await searcher(keywords, limit);

	if (result?.length == 0) {
		throw new BotError(lang.song.notFound);
	}

	return result;
};

export const info = async (url: string): Promise<UnresolvedSong | Playlist> => {
	let getter: getter | undefined;

	if (url.match(SOUNDCLOUD_REGEX)) {
		const parsed = new URL(url);

		parsed.search = '';

		url = parsed.href;

		getter = soundcloud.track;
	}

	if (url.match(SOUNDCLOUD_SETS_REGEX)) {
		getter = soundcloud.playlist;
	}

	if (url.match(SPOTIFY_REGEX)) {
		getter = spotify.get;
	}

	const extension = url.split('.').pop();

	if (extension && AUDIO_FILE_EXTENSIONS.includes(extension.toLowerCase())) {
		getter = file.metadata;
	}

	if (!getter) throw new BotError(lang.song.notFound);

	return await getter(url);
};
