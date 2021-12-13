import { Client, Intents } from 'discord.js';

import Cache from '@utils/cache';
import * as Logger from '@utils/logger';

import updateCommands from '@src/updater';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

console.time('bot-start');

client.on('ready', async () => {
	if (!client.user || !client.application) {
		process.exit();
	}

	console.timeEnd('bot-start');

	Logger.log(`Started up client ${client.user.tag}`);

	client.user.setActivity({ name: '/help', type: 'LISTENING' });

	await Cache.init();

	await updateCommands(client.application);
});

export default client;
