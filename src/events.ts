import { Interaction } from 'discord.js';

import handleButtons from '@src/buttons';
import client from '@src/client';
import Commands from '@src/commands';

client.on('interactionCreate', async (interaction: Interaction) => {
	if (interaction.isCommand()) {
		const command = Commands.get(interaction.commandName);

		if (command != undefined) {
			await command(interaction).catch((error) => {
				interaction.reply('An error occurred while processing your command :(');

				console.error(error);
			});

			return;
		}

		await interaction.reply('Could not find that command.');

		return;
	}

	if (interaction.isButton()) {
		await handleButtons(interaction);
	}
});
