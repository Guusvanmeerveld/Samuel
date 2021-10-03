import Command from '@models/command';

import { DefaultEmbed } from '@utils/embed';

import Commands from '@src/config/commands.config';

export const help: Command = (interaction) => {
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

		interaction.reply(`❌ Could not find a command matching \`${toFind.value}\``);
	}

	const embed = new DefaultEmbed().setTitle('Showing a list of all commands');

	interaction.reply({ embeds: [embed] });
};
