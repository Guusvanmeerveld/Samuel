import Command from '@models/command';

import { DefaultEmbed } from '@utils/embed';

import * as Utils from '@utils/index';

import Commands from '@src/config/commands.config';

export const help: Command = async (interaction) => {
	const toFind = interaction.options.get('command');

	if (toFind?.value) {
		const command = Commands.find((cmd) => cmd.name.includes(toFind.value as string));

		if (command) {
			const embed = new DefaultEmbed()
				.setTitle(`Showing info for the command \`${command.name}\``)
				.setDescription(`Description: \`${command.description}\``)
				.addField('Options:', `\`${command.options?.map((option) => option.name)?.join(', ')}\``);

			interaction.reply({ embeds: [embed] });

			return;
		}

		interaction.reply(`❌ Could not find a command matching \`${toFind.value}\`.`);

		return;
	}

	const page = (interaction.options.get('page')?.value as number) ?? 1;

	const list = Utils.chunk(Commands);

	if (page <= 0 || page > list.length) {
		interaction.reply(`\`${page}\` is not a valid page number.`);
		return;
	}

	const commands = list[page - 1];

	const embed = new DefaultEmbed()
		.setTitle('Showing a list of all commands')
		.setFooter('Page ' + page + '/' + list.length);

	commands.forEach((command) => {
		embed.addField(`Name: \`${command.name}\``, `Description: \`${command.description}\``);
	});

	interaction.reply({ embeds: [embed] });
};
