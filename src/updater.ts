import { ClientApplication } from 'discord.js';

import axios, { AxiosError } from 'axios';

import * as cache from '@utils/cache';

import { BOT_TOKEN, DISCORD_API_VERSION } from '@global/config';
import commands from '@global/config/commands.config';
import lang from '@global/lang';
import * as Logger from '@global/utils/logger';

const DISCORD_ENDPOINT = 'https://discord.com/api/v' + DISCORD_API_VERSION;

const updater = async (application: ClientApplication): Promise<void> => {
	const expires = await cache.get<boolean | null>('commandsUpdated');

	if (!expires) {
		await axios
			.put(`${DISCORD_ENDPOINT}/applications/${application.id}/commands`, commands, {
				headers: { Authorization: `Bot ${BOT_TOKEN}` },
			})
			.then(async (res) => {
				await cache.set('commandsUpdated', true);

				Logger.log(lang.commands.updater.updated(commands.length));

				return res;
			})
			.catch(async ({ response }: AxiosError) => {
				if (response?.status == 429 && response.data.retry_after) {
					const retryIn = response.data.retry_after * 1000 + 1000;

					Logger.warn(
						`Ratelimited by Discord while trying to update commands! Retrying in ${retryIn / 1000}s`
					);

					await cache.set('commandsUpdated', true, Date.now() + retryIn);

					setTimeout(async () => await updater(application), retryIn);

					return;
				}

				Logger.warn(lang.commands.updater.error);

				console.error(response?.data);
			});
	}
};

export default updater;
