import { hash } from '.';
import Redis from 'ioredis';

import { getter, setter, deleter } from '@models/cache';

import * as Logger from '@utils/logger';

import { REDIS_URL } from '@src/config';

let client: Redis.Redis;

export const init = (): void => {
	client = new Redis(REDIS_URL);

	client.on('connect', () => {
		Logger.log('Connected with Redis db');
	});

	client.on('error', (error) => {
		Logger.error('Failed to connect to Redis db:');

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
