import { Client, Intents } from 'discord.js';

import * as Logger from '@utils/logger';

import lang from '@src/lang';
import updateCommands from '@src/updater';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

console.time('bot-start');

client.on('ready', async () => {
	if (!client.user || !client.application) {
		process.exit();
	}

	console.timeEnd('bot-start');

	Logger.log(lang.bot.startup(client.user.tag));

	client.user.setActivity({ name: lang.bot.activity.name, type: 'LISTENING' });

	await updateCommands(client.application);
});

export default client;
