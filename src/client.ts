import { Client, Intents } from 'discord.js';

import Cache from '@utils/cache';

import updateCommands from '@src/updater';

const client = new Client({ intents: Intents.FLAGS.GUILDS });

client.on('ready', async () => {
	if (!client.user || !client.application) {
		process.exit();
	}

	console.log(`Started up client ${client.user.tag}`);

	client.user.setActivity({ name: '/help', type: 'LISTENING' });

	await Cache.init();

	await updateCommands(client.application);
});

export default client;
