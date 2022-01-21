import lang from '@global/lang';
import Command from '@global/models/command';

export const ping: Command = async (interaction) => {
	await interaction.reply(lang.commands.ping(Date.now() - interaction.createdAt.getTime()));
};
