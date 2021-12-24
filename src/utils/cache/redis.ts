import { hash } from '.';

import Redis from 'ioredis';

import { getter, setter, deleter } from '@models/cache';

import * as Logger from '@utils/logger';

import { REDIS_URL } from '@src/config';
import lang from '@src/lang';

let client: Redis.Redis;

export const init = (): void => {
	client = new Redis(REDIS_URL);

	client.on('connect', () => {
		Logger.log(lang.redis.connected);
	});

	client.on('error', (error) => {
		Logger.error(lang.redis.failed);

		Logger.error(error);
	});
};

export const get: getter = async (key) => {
	const data = await client.get(hash(key));

	if (!data) return;

	return JSON.parse(data);
};

export const set: setter = async (key, value) => {
	await client.set(hash(key), JSON.stringify(value));
};

export const unset: deleter = async (key) => {
	await client.set(hash(key), '');
};
