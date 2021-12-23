import Command from '@models/command';
import BotError, { ErrorType } from '@models/errors';

import Player from '@utils/player';

export const resume: Command = async (interaction) => {
	const guild = interaction.guild!;

	const player = new Player(guild.id);

	await player
		.pause(false, false)
		.then(() => interaction.reply(ErrorType.Resumed))
		.catch((e: BotError) => interaction.reply(e.message));
};
