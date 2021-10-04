import Redis from 'ioredis';

import { getter, setter } from '@models/cache';

import { REDIS_URL } from '@src/config';

let client: Redis.Redis;

export const init = (): void => {
	client = new Redis(REDIS_URL);

	client.on('connect', () => {
		console.log('Connected with Redis db');
	});

	client.on('error', (error) => {
		console.error('Failed to connect to Redis db:');

		console.error(error);
	});
};

export const get: getter = async (key) => {
	return await client.get(key);
};

export const set: setter = async (key, value) => {
	await client.set(key, value);
};
