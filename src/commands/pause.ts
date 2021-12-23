import Command from '@models/command';
import BotError, { ErrorType } from '@models/errors';

import Player from '@utils/player';

export const pause: Command = async (interaction) => {
	const guild = interaction.guild!;

	const player = new Player(guild.id);

	await player
		.pause(false, true)
		.then(() => interaction.reply(ErrorType.Paused))
		.catch((e: BotError) => interaction.reply(e.message));
};
