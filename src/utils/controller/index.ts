import * as file from './file';
import * as soundcloud from './soundcloud';

import BotError from '@models/errors';
import { getter, searcher } from '@models/platform';
import Playlist from '@models/playlist';
import Song from '@models/song';

import {
	AUDIO_FILE_EXTENSIONS,
	SEARCH_RESULT_LIMIT,
	SOUNDCLOUD_REGEX,
	SOUNDCLOUD_SETS_REGEX,
} from '@src/config/constants.config';
import lang from '@src/lang';

export const search = async (
	keywords: string[],
	limit = SEARCH_RESULT_LIMIT,
	platform = 'soundcloud'
): Promise<Song[]> => {
	let searcher: searcher | undefined;

	if (platform == 'soundcloud') {
		searcher = soundcloud.search;
	}

	if (!searcher) throw new BotError(lang.song.notFound);

	const result = await searcher(keywords, limit);

	if (result.length == 0) {
		throw new BotError(lang.song.notFound);
	}

	return result;
};

export const info = async (url: string): Promise<Song | Playlist> => {
	let getter: getter | undefined;

	if (url.match(SOUNDCLOUD_REGEX)) {
		getter = soundcloud.track;
	}

	if (url.match(SOUNDCLOUD_SETS_REGEX)) {
		getter = soundcloud.playlist;
	}

	const extension = url.split('.').pop();

	if (extension && AUDIO_FILE_EXTENSIONS.includes(extension.toLowerCase())) {
		getter = file.metadata;
	}

	if (!getter) throw new BotError(lang.song.notFound);

	return await getter(url);
};
