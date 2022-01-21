import fs from 'fs-extra';
import * as mm from 'music-metadata';
import { join } from 'path';

import axios from 'axios';

import BotError from '@models/errors';
import { getter } from '@models/platform';
import { UnresolvedSong } from '@models/song';

import { hash } from '@utils/cache';

import { CACHE_LOCATION, MAX_AUDIO_FILE_SIZE, PLACEHOLDER_IMG } from '@global/config';
import lang from '@global/lang';

const playable = { isPlaylist: () => false, isSong: () => true };

export const metadata: getter = async (url): Promise<UnresolvedSong> => {
	const hashed = hash(url);
	const dir = join(CACHE_LOCATION, 'songs');
	const path = join(dir, hashed);

	await fs.ensureDir(dir);

	if (!(await fs.pathExists(path))) {
		const writer = fs.createWriteStream(path);

		const response = await axios({
			url,
			headers: {
				'User-Agent': 'Tempo-Bot',
			},
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

	const data = await mm.parseFile(path, { duration: true });

	const names = data.format.trackInfo
		.map((item) => item.name)
		.filter((item) => item != undefined && item != '');

	const name = names[0] ?? url;
	const platform = 'file';

	const song: UnresolvedSong = {
		resolve: async () => ({
			...playable,
			length: data.format.duration ?? 0,
			artwork: PLACEHOLDER_IMG,
			name,
			url,
			platform,
			streamURL: path,
			artists: ['Unknown'],
			released: data.format.creationTime ?? new Date(),
		}),
		...playable,
		platform,
		identifier: url,
	};

	return song;
};
