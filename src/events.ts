import { Interaction } from 'discord.js';

import client from '@src/client';

import Commands from '@src/commands';

client.on('interactionCreate', async (interaction: Interaction) => {
	if (interaction.isCommand()) {
		const command = Commands.get(interaction.commandName);

		if (command != undefined) {
			await command(interaction);

			return;
		}

		interaction.reply('Could not find that command.');
	}
});
