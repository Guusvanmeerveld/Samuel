import { DefaultEmbed } from '@utils/embed';

import Commands from '@global/config/commands.config';
import lang from '@global/lang';
import Command from '@global/models/command';

import * as Utils from '@src/utils';

export const help: Command = async (interaction) => {
	const toFind = interaction.options.get('command');

	if (toFind?.value) {
		const command = Commands.find((cmd) => cmd.name.includes(toFind.value as string));

		if (command) {
			const embed = new DefaultEmbed()
				.setTitle(lang.commands.help.command.title(command.name))
				.setDescription(lang.commands.help.command.description(command.description ?? ''));

			if (command.options)
				embed.addField(
					lang.commands.help.command.options,
					`\`${command.options.map((option) => option.name)?.join(', ')}\``
				);

			interaction.reply({ embeds: [embed] });

			return;
		}

		interaction.reply(lang.commands.help.command.notFound(toFind.value as string));

		return;
	}

	const page = (interaction.options.get('page')?.value as number) ?? 1;

	const list = Utils.chunk(Commands);

	if (page <= 0 || page > list.length) {
		interaction.reply(lang.commands.help.list.page(page));
		return;
	}

	const commands = list[page - 1];

	const embed = new DefaultEmbed()
		.setTitle(lang.commands.help.list.title)
		.setFooter(lang.commands.help.list.footer(page, list.length));

	commands.forEach((command) => {
		embed.addField(
			lang.commands.help.list.name(command.name),
			lang.commands.help.list.description(command.description ?? '')
		);
	});

	interaction.reply({ embeds: [embed] });
};
