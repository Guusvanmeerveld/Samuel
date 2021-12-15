import Song from '@models/song';

import { getter, searcher } from '@models/platform';
import BotError, { ErrorType } from '@models/errors';

import { SEARCH_RESULT_LIMIT, SOUNDCLOUD_REGEX } from '@src/config/constants.config';

import * as soundcloud from './soundcloud';

export const search = async (
	keywords: string[],
	limit = SEARCH_RESULT_LIMIT,
	platform = 'soundcloud'
): Promise<Song[]> => {
	let searcher: searcher | undefined;

	if (platform == 'soundcloud') {
		searcher = soundcloud.search;
	}

	if (!searcher) throw new BotError('Could not find a song', ErrorType.NotFound);

	return await searcher(keywords, limit);
};

export const info = async (url: string): Promise<Song> => {
	let getter: getter | undefined;

	if (url.match(SOUNDCLOUD_REGEX)) {
		getter = soundcloud.track;
	}

	if (!getter) throw new BotError('Could not find a song with that url', ErrorType.NotFound);

	return await getter(url);
};
