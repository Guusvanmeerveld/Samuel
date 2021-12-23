import { ButtonInteraction } from 'discord.js';

import { ErrorType } from '@models/errors';

import Player from '@utils/player';

const UNKNOWN = 'Nothing';

const handleButtons = async (interaction: ButtonInteraction): Promise<void> => {
	const player = new Player(interaction.guildId);

	try {
		switch (interaction.customId) {
			case 'previous-song':
				const previous = player.move('back');

				interaction.reply(
					`Skipped \`${previous[0] ?? UNKNOWN}\`, started playing \`${previous[1] ?? UNKNOWN}\``
				);

				break;

			case 'pause-song':
				const paused = await player.pause();

				interaction.reply(paused ? ErrorType.Paused : ErrorType.Resumed);

				break;

			case 'next-song':
				const next = player.move('forward');

				interaction.reply(
					`Skipped \`${next[0] ?? UNKNOWN}\`, started playing \`${next[1] ?? UNKNOWN}\``
				);

				break;
		}
	} catch (e: any) {
		await interaction.reply(e.message);
	}
};

export default handleButtons;
