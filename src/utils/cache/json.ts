import { ensureFile, readFile, readJSON, writeJSON } from 'fs-extra';

import { hash } from '.';

import { join } from 'path';

import { CACHE_LOCATION } from '@src/config';

import { deleter, getter, setter } from '@models/cache';

const CACHE_FILE = join(CACHE_LOCATION, 'cache.json');

export const init = async (): Promise<void> => {
	await ensureFile(CACHE_FILE);

	const isNotEmpty = await readFile(CACHE_FILE);

	if (!isNotEmpty.toString()) {
		await writeJSON(CACHE_FILE, {});
	}
};

export const get: getter = async <T>(key: string) => {
	const data: Record<string, T> = await readJSON(CACHE_FILE);

	return data[hash(key)];
};

export const set: setter = async (key, value) => {
	const data: Record<string, unknown> = await readJSON(CACHE_FILE);

	const updated = {
		...data,
		[hash(key)]: value,
	};

	await writeJSON(CACHE_FILE, updated);
};

export const unset: deleter = async (key) => {
	const data: Record<string, unknown> = await readJSON(CACHE_FILE);

	delete data[hash(key)];

	await writeJSON(CACHE_FILE, data);
};
