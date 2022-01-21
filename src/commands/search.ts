import BotError from '@models/errors';
import { UnresolvedSong } from '@models/song';

import * as Controller from '@utils/controller';
import { DefaultEmbed } from '@utils/embed';

import lang from '@global/lang';
import Command from '@global/models/command';

export const search: Command = async (interaction) => {
	const keywords = interaction.options.get('keywords')?.value as string;
	const platform = interaction.options.get('platform')?.value as string | undefined;

	const search = await Controller.search(keywords.split(' '), 10, platform?.toLowerCase()).catch(
		(error: BotError) => {
			return error;
		}
	);

	if (!search) {
		await interaction.reply(lang.player.playlistNoSongs);
		return;
	}

	if (search instanceof BotError) {
		await interaction.reply(search.message);
		return;
	}

	await interaction.reply({ embeds: [await createEmbed(search, keywords)] });
};

const createEmbed = async (songs: UnresolvedSong[], keywords: string): Promise<DefaultEmbed> => {
	const embed = createBaseEmbed(keywords);

	const embedFields = await Promise.all(
		songs.map(async (unresolved, i) => {
			const song = await unresolved.resolve();

			const field: [number, string, string] = [
				i,
				`#${i + 1} - ${song.name}`,
				`Artists: ${song.artists.join(' ')}`,
			];

			return field;
		})
	);

	embed.addFields(
		embedFields.sort(([a], [b]) => a - b).map(([, name, value]) => ({ name, value }))
	);

	return embed;
};

const createBaseEmbed = (keywords: string) =>
	new DefaultEmbed().setTitle(lang.embeds.search.title(keywords));
