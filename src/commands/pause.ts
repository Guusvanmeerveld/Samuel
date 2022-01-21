import BotError from '@models/errors';

import Player from '@utils/player';

import lang from '@global/lang';
import Command from '@global/models/command';

export const pause: Command = async (interaction) => {
	const guild = interaction.guild!;

	const player = new Player(guild.id);

	await player
		.pause(false, true)
		.then(() => interaction.reply(lang.player.paused))
		.catch((e: BotError) => interaction.reply(e.message));
};
