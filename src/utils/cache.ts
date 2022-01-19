import { createHash } from 'crypto';

import Redis from 'ioredis';

import { getter, setter, unsetter } from '@models/cache';

import * as Logger from '@global/utils/logger';

import { CACHE_TIMEOUT, REDIS_PASSWORD, REDIS_URL, REDIS_USER } from '@src/config';
import lang from '@src/lang';

export const hash = (string: string): string => createHash('sha256').update(string).digest('hex');

let connected = false;

const client = new Redis(REDIS_URL, {
	password: REDIS_PASSWORD,
	username: REDIS_USER,
	retryStrategy: (times) => (times > 1 ? 10000 : 0),
	lazyConnect: true,
	enableOfflineQueue: true,
});

export const connect = async (): Promise<boolean> => {
	if (connected) return connected;

	client.connect();

	return await new Promise((resolve) => {
		client.on('connect', () => {
			Logger.log(lang.redis.connected);

			connected = true;

			resolve(connected);
		});

		client.on('error', (error) => {
			Logger.error(lang.redis.failed);

			Logger.error(error);

			connected = false;

			resolve(connected);
		});
	});
};

export const get: getter = async (key) => {
	const data = await client.get(hash(key));

	if (!data) return;

	return JSON.parse(data);
};

export const set: setter = async (key, value, expires = CACHE_TIMEOUT) => {
	await client.set(hash(key), JSON.stringify(value), 'PX', expires);
};

export const unset: unsetter = async (key) => {
	await client.set(hash(key), '');
};
