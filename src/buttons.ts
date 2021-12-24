import { ButtonInteraction } from 'discord.js';

import Player from '@utils/player';

import lang from '@src/lang';

const handleButtons = async (interaction: ButtonInteraction): Promise<void> => {
	const player = new Player(interaction.guildId);

	try {
		switch (interaction.customId) {
			case 'previous-song':
				const previous = player.move('back');

				interaction.reply(lang.player.move(previous[0], previous[1]));

				break;

			case 'pause-song':
				const paused = await player.pause();

				interaction.reply(paused ? lang.player.paused : lang.player.resume);

				break;

			case 'next-song':
				const next = player.move('forward');

				interaction.reply(lang.player.move(next[0], next[1]));

				break;
		}
	} catch (e: any) {
		await interaction.reply(e.message);
	}
};

export default handleButtons;
