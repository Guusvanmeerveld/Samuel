import Command from '@models/command';
import BotError from '@models/errors';
import Song from '@models/song';

import * as Controller from '@utils/controller';
import { DefaultEmbed } from '@utils/embed';

import lang from '@src/lang';

export const search: Command = async (interaction) => {
	const keywords = interaction.options.get('keywords')?.value as string;
	const platform = interaction.options.get('platform')?.value as string | undefined;

	const search = await Controller.search(keywords.split(' '), 10, platform)
		.catch((error: BotError) => {
			return error;
		})
		.then((songs) => songs);

	if (search instanceof BotError) {
		await interaction.reply(search.message);
		return;
	}

	await interaction.reply({ embeds: [createEmbed(search, keywords)] });
};

const createEmbed = (songs: Song[], keywords: string): DefaultEmbed => {
	const embed = createBaseEmbed(keywords);

	songs.forEach((song, i) =>
		embed.addField(`#${i + 1} - ${song.name}`, `Artists: ${song.artists.join(' ')}`)
	);

	return embed;
};

const createBaseEmbed = (keywords: string) =>
	new DefaultEmbed().setTitle(lang.embeds.search.title(keywords));
