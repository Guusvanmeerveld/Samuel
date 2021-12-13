import Song from '@models/song';

import { getter } from '@models/platform';
import BotError, { ErrorType } from '@models/errors';

import { SOUNDCLOUD_REGEX } from '@src/config/constants.config';

import * as soundcloud from './soundcloud';

// export const search = async (keywords: string[], platform: Platform): Promise<Song[]> => {};

export const info = async (url: string): Promise<Song> => {
	let getter: getter | undefined;

	if (url.match(SOUNDCLOUD_REGEX)) {
		getter = soundcloud.track;
	}

	if (!getter) throw new BotError('Could not find a song with that url', ErrorType.NotFound);

	return await getter(url);
};
