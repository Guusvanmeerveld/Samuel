import { Interaction } from 'discord.js';

import handleButtons from '@src/buttons';
import client from '@src/client';
import Commands from '@src/commands';
import lang from '@src/lang';

client.on('interactionCreate', async (interaction: Interaction) => {
	if (interaction.isCommand()) {
		const command = Commands.get(interaction.commandName);

		if (command != undefined) {
			await command(interaction).catch(async (error) => {
				await interaction
					.reply(lang.commands.error)
					.catch(async () => await interaction.followUp(lang.commands.error));

				console.error(error);
			});

			return;
		}

		await interaction.reply(lang.commands.notFound);

		return;
	}

	if (interaction.isButton()) {
		await handleButtons(interaction);
	}
});
