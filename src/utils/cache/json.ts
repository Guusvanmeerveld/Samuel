import { ensureFile, readFile, readJSON, writeJSON } from 'fs-extra';

import { join } from 'path';

import { CACHE_LOCATION } from '@src/config';

import { getter, setter } from '@models/cache';

const CACHE_FILE = join(CACHE_LOCATION, 'cache.json');

export const init = async (): Promise<void> => {
	await ensureFile(CACHE_FILE);

	const isNotEmpty = await readFile(CACHE_FILE);

	if (!isNotEmpty.toString()) {
		await writeJSON(CACHE_FILE, {});
	}
};

export const get: getter = async (key) => {
	const data: Record<string, string | number> = await readJSON(CACHE_FILE);

	return data[key];
};

export const set: setter = async (key, value) => {
	const data: Record<string, unknown> = await readJSON(CACHE_FILE);

	const updated = {
		...data,
		[key]: value,
	};

	await writeJSON(CACHE_FILE, updated);
};
