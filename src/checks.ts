import ping from 'ping';

import * as Logger from '@utils/logger';

import { testToken } from '@utils/controller/soundcloud';

import { PING_ADDRESS, SOUNDCLOUD_TOKEN } from '@src/config';

const preStartChecks = async (): Promise<void> => {
	Logger.log('Checking network status...');

	await ping.promise.probe(PING_ADDRESS).then(({ alive }) => {
		if (alive) Logger.log('Network check succeeded');
		else {
			Logger.error(`Could not ping ${PING_ADDRESS}, stopping`);
			process.exit();
		}
	});

	if (!SOUNDCLOUD_TOKEN) {
		Logger.error('Could not find SOUNDCLOUD_TOKEN variable, stopping');
		process.exit();
	}

	Logger.log('Validating SoundCloud token...');

	const isValid = await testToken();

	if (isValid) Logger.log('SoundCloud token check succeeded');
	else {
		Logger.error('Could not validate Soundcloud token, stopping');
		process.exit();
	}
};

export default preStartChecks;
