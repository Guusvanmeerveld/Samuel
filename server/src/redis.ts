import Redis from 'ioredis';

import { REDIS_PASSWORD, REDIS_URL, REDIS_USER } from '@global/config';
import lang from '@global/lang';
import * as Logger from '@global/utils/logger';

const client = new Redis(REDIS_URL, {
	password: REDIS_PASSWORD,
	username: REDIS_USER,
	retryStrategy: (times) => (times > 1 ? 10000 : 0),
	lazyConnect: true,
	enableOfflineQueue: true,
});

let connected = false;

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
