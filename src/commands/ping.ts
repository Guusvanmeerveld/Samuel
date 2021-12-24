import Command from '@models/command';

import lang from '@src/lang';

export const ping: Command = async (interaction) => {
	await interaction.reply(lang.commands.ping(Date.now() - interaction.createdAt.getTime()));
};
