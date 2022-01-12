import { ClientApplication } from 'discord.js';

import axios, { AxiosError } from 'axios';

import Cache from '@utils/cache';
import * as Logger from '@utils/logger';

import { BOT_TOKEN, CACHE_TIMEOUT, DISCORD_API_VERSION } from '@src/config';
import commands from '@src/config/commands.config';
import lang from '@src/lang';

const cache = new Cache<number>('updater');

const DISCORD_ENDPOINT = 'https://discord.com/api/v' + DISCORD_API_VERSION;

const updater = async (application: ClientApplication): Promise<void> => {
	if (!cache.initialized()) {
		await cache.init();
	}

	const expires = (await cache.get('commandsUpdated')) as number | null;

	if (!expires || (expires && expires < Date.now())) {
		await axios
			.put(`${DISCORD_ENDPOINT}/applications/${application.id}/commands`, commands, {
				headers: { Authorization: `Bot ${BOT_TOKEN}` },
			})
			.then(async (res) => {
				await cache.set('commandsUpdated', Date.now() + CACHE_TIMEOUT);

				Logger.log(lang.commands.updater.updated(commands.length));

				return res;
			})
			.catch(async ({ response }: AxiosError) => {
				if (response?.status == 429 && response.data.retry_after) {
					const retryIn = response.data.retry_after * 1000 + 1000;

					Logger.warn(
						`Ratelimited by Discord while trying to update commands! Retrying in ${retryIn / 1000}s`
					);

					await cache.set('commandsUpdated', Date.now() + retryIn);

					setTimeout(async () => await updater(application), retryIn);

					return;
				}

				Logger.warn(lang.commands.updater.error);

				console.error(response?.data);
			});
	}
};

export default updater;
