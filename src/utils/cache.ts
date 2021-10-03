import { ensureFile, readFile, readJSON, writeJSON } from 'fs-extra';

import { join } from 'path';

import { CACHE_LOCATION } from '@src/config';

const CACHE_FILE = join(CACHE_LOCATION, 'cache.json');

export const init = async (): Promise<void> => {
	await ensureFile(CACHE_FILE);

	const isNotEmpty = await readFile(CACHE_FILE);

	if (!isNotEmpty.toString()) {
		await writeJSON(CACHE_FILE, {});
	}
};

export const get = async <T>(key: string): Promise<T> => {
	const data: Record<string, T> = await readJSON(CACHE_FILE);

	return data[key];
};

export const set = async <T>(key: string, value: T): Promise<boolean> => {
	const data: Record<string, unknown> = await readJSON(CACHE_FILE);

	const updated = {
		...data,
		[key]: value,
	};

	return writeJSON(CACHE_FILE, updated)
		.then(() => true)
		.catch(() => false);
};
