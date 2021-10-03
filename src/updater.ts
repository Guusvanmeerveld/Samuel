import { ClientApplication } from 'discord.js';

import axios, { AxiosError } from 'axios';

import * as Cache from '@utils/cache';

import commands from '@src/config/commands.config';

import { BOT_TOKEN, CACHE_TIMEOUT } from '@src/config';

const DISCORD_ENDPOINT = 'https://discord.com/api/v9';

const updater = async (application: ClientApplication): Promise<void> => {
	const lastUpdated: number = await Cache.get('commandsUpdated');

	if (!lastUpdated || (lastUpdated && lastUpdated + CACHE_TIMEOUT < Date.now())) {
		await axios
			.put(`${DISCORD_ENDPOINT}/applications/${application.id}/commands`, commands, {
				headers: { Authorization: `Bot ${BOT_TOKEN}` },
			})
			.then(async (res) => {
				await Cache.set('commandsUpdated', Date.now());

				console.log(`Updated ${commands.length} command(s)`);

				return res;
			})
			.catch((error: AxiosError) => {
				console.log(error.response?.data);
			});
	}
};

export default updater;
