import BotError from '@models/errors';

import Player from '@utils/player';

import lang from '@global/lang';
import Command from '@global/models/command';

export const resume: Command = async (interaction) => {
	const guild = interaction.guild!;

	const player = new Player(guild.id);

	await player
		.pause(false, false)
		.then(() => interaction.reply(lang.player.resume))
		.catch((e: BotError) => interaction.reply(e.message));
};
