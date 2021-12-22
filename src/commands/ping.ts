import Command from '@models/command';

export const ping: Command = async (interaction) => {
	await interaction.reply(`Pong! took \`${Date.now() - interaction.createdTimestamp}ms\``);
};
