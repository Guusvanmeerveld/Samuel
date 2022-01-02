import fs from 'fs-extra';
import * as mm from 'music-metadata';
import { join } from 'path';

import axios from 'axios';

import BotError from '@models/errors';
import { getter } from '@models/platform';
import Song from '@models/song';

import { hash } from '@utils/cache';

import { CACHE_LOCATION, MAX_AUDIO_FILE_SIZE, PLACEHOLDER_IMG } from '@src/config';
import lang from '@src/lang';

export const metadata: getter = async (url): Promise<Song> => {
	const hashed = hash(url);
	const path = join(CACHE_LOCATION, 'songs', hashed);

	if (!(await fs.pathExists(path))) {
		const writer = fs.createWriteStream(path);

		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream',
			maxBodyLength: MAX_AUDIO_FILE_SIZE,
		})
			.catch(() => {
				throw new BotError(lang.song.notFound);
			})
			.then((res) => res);

		response.data.pipe(writer);

		await new Promise((resolve) => {
			writer.on('finish', resolve);
			writer.on('error', () => {
				throw new BotError(lang.song.errorFetchingFile);
			});
		});
	}

	const data = await mm.parseFile(path);

	const names = data.format.trackInfo
		.map((item) => item.name)
		.filter((item) => item != undefined && item != '');

	const song: Song = {
		length: data.format.duration ?? 0,
		artwork: PLACEHOLDER_IMG,
		isPlaylist: () => false,
		isSong: () => true,
		name: names[0] ?? url,
		platform: 'file',
		url,
		streamURL: async () => path,
		artists: ['Unknown'],
		released: data.format.creationTime ?? new Date(),
	};

	return song;
};
