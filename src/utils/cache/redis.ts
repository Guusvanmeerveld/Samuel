import { hash } from '.';

import Redis from 'ioredis';

import { getter, setter, unsetter } from '@models/cache';

import * as Logger from '@utils/logger';

import { REDIS_PASSWORD, REDIS_URL, REDIS_USER } from '@src/config';
import lang from '@src/lang';

let client: Redis.Redis;

export default class DB<T> {
	private connected = false;

	init = async (): Promise<void> => {
		client = new Redis(REDIS_URL, {
			password: REDIS_PASSWORD,
			username: REDIS_USER,
		});

		client.on('connect', () => {
			Logger.log(lang.redis.connected);
			this.connected = true;
		});

		client.on('error', (error) => {
			Logger.error(lang.redis.failed);

			Logger.error(error);
		});
	};

	public initialized = (): boolean => Object.keys(this.connected).length != 0;

	get: getter<T> = async (key) => {
		const data = await client.get(hash(key));

		if (!data) return;

		return JSON.parse(data);
	};

	set: setter<T> = async (key, value) => {
		await client.set(hash(key), JSON.stringify(value));
	};

	unset: unsetter = async (key) => {
		await client.set(hash(key), '');
	};
}
