import * as soundcloud from './soundcloud';

import BotError, { ErrorType } from '@models/errors';
import { getter, searcher } from '@models/platform';
import Playlist from '@models/playlist';
import Song from '@models/song';

import {
	SEARCH_RESULT_LIMIT,
	SOUNDCLOUD_REGEX,
	SOUNDCLOUD_SETS_REGEX,
} from '@src/config/constants.config';

export const search = async (
	keywords: string[],
	limit = SEARCH_RESULT_LIMIT,
	platform = 'soundcloud'
): Promise<Song[]> => {
	let searcher: searcher | undefined;

	if (platform == 'soundcloud') {
		searcher = soundcloud.search;
	}

	if (!searcher) throw new BotError(ErrorType.NotFound);

	return await searcher(keywords, limit);
};

export const info = async (url: string): Promise<Song | Playlist> => {
	let getter: getter | undefined;

	if (url.match(SOUNDCLOUD_REGEX)) {
		getter = soundcloud.track;
	}

	if (url.match(SOUNDCLOUD_SETS_REGEX)) {
		getter = soundcloud.playlist;
	}

	if (!getter) throw new BotError(ErrorType.NotFound);

	return await getter(url);
};
