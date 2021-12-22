import { ClientApplication } from 'discord.js';

import axios, { AxiosError } from 'axios';

import Cache from '@utils/cache';
import * as Logger from '@utils/logger';

import { BOT_TOKEN, CACHE_TIMEOUT, DISCORD_API_VERSION } from '@src/config';
import commands from '@src/config/commands.config';

const DISCORD_ENDPOINT = 'https://discord.com/api/v' + DISCORD_API_VERSION;

const updater = async (application: ClientApplication): Promise<void> => {
	const lastUpdated = (await Cache.get('commandsUpdated')) as number | null;

	if (!lastUpdated || (lastUpdated && lastUpdated + CACHE_TIMEOUT < Date.now())) {
		await axios
			.put(`${DISCORD_ENDPOINT}/applications/${application.id}/commands`, commands, {
				headers: { Authorization: `Bot ${BOT_TOKEN}` },
			})
			.then(async (res) => {
				await Cache.set('commandsUpdated', Date.now());

				Logger.log(`Updated ${commands.length} command(s)`);

				return res;
			})
			.catch((error: AxiosError) => {
				Logger.warn('Failed to update commands:');

				console.error(error.response?.data.errors);
			});
	}
};

export default updater;
