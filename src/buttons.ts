import { ButtonInteraction } from 'discord.js';
import Player from '@utils/player';

const UNKNOWN = 'Nothing';

const handleButtons = async (interaction: ButtonInteraction): Promise<void> => {
	const player = new Player(interaction.guildId);

	switch (interaction.customId) {
		case 'previous-song':
			const previous = player.move('back');

			interaction.reply(
				`Skipped \`${previous[0] ?? UNKNOWN}\`, started playing \`${previous[1] ?? UNKNOWN}\``
			);

			break;

		case 'pause-song':
			const paused = player.pause();

			interaction.reply(paused ? 'Paused the current song' : 'Resumed the current song.');

			break;

		case 'next-song':
			const next = player.move('forward');

			interaction.reply(
				`Skipped \`${next[0] ?? UNKNOWN}\`, started playing \`${next[1] ?? UNKNOWN}\``
			);

			break;
	}
};

export default handleButtons;
