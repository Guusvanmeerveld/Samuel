import ping from 'ping';

import * as cache from '@utils/cache';
import { fetchToken, testToken } from '@utils/controller/soundcloud';
import * as Logger from '@utils/logger';

import { PING_ADDRESS, SOUNDCLOUD_TOKEN } from '@src/config';
import lang from '@src/lang';

const preStartChecks = async (): Promise<void> => {
	Logger.log(lang.checks.network.status);

	await ping.promise.probe(PING_ADDRESS).then(({ alive }) => {
		if (alive) Logger.log(lang.checks.network.success);
		else {
			Logger.error(lang.checks.network.error(PING_ADDRESS));
			process.exit();
		}
	});

	const redisConnected = await cache.connect();

	if (!redisConnected) {
		process.exit();
	}

	let token = SOUNDCLOUD_TOKEN;

	if (!token) {
		token = await fetchToken();
	}

	Logger.log(lang.checks.soundcloud.status);

	const soundCloudTokenisValid = await testToken(token);

	if (soundCloudTokenisValid) Logger.log(lang.checks.soundcloud.success);
	else {
		Logger.error(lang.checks.soundcloud.error);
		process.exit();
	}
};

export default preStartChecks;
