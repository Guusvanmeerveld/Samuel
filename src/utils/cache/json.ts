import { hash } from '.';
import { ensureFile, readFile, readJSON, writeJSON } from 'fs-extra';
import { join } from 'path';

import { getter, setter, unsetter } from '@models/cache';

import { CACHE_LOCATION } from '@src/config';

export default class DB<T> {
	private data: Record<string, T> = {};
	private cacheFile;

	constructor(name: string) {
		this.cacheFile = join(CACHE_LOCATION, name, 'cache.json');
	}

	public init = async (): Promise<void> => {
		await ensureFile(this.cacheFile);

		const isNotEmpty = await readFile(this.cacheFile);

		if (!isNotEmpty.toString()) {
			await writeJSON(this.cacheFile, {});
		}

		this.data = await readJSON(this.cacheFile);
	};

	public initialized = (): boolean => Object.keys(this.data).length != 0;

	public get: getter<T> = async (key) => {
		return this.data[hash(key)];
	};

	public set: setter<T> = async (key, value) => {
		this.data[hash(key)] = value;

		await writeJSON(this.cacheFile, this.data);
	};

	public unset: unsetter = async (key) => {
		const data: Record<string, unknown> = await readJSON(this.cacheFile);

		delete data[hash(key)];

		await writeJSON(this.cacheFile, data);
	};
}
