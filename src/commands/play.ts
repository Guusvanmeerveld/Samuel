import * as Controller from '@utils/controller';

import BotError, { ErrorType } from '@models/errors';
import { GuildMember, MessageActionRow, MessageButton } from 'discord.js';

import Command from '@models/command';
import { DefaultEmbed } from '@utils/embed';
import Player from '@utils/player';
import Song from '@models/song';
import VoiceManager from '@utils/voice';

export const play: Command = async (interaction) => {
	const url = interaction.options.get('url')?.value;
	const keywords = interaction.options.get('keywords')?.value as string;

	if (url || keywords) {
		const member = interaction.member as GuildMember;

		if (!member.voice.channelId) {
			interaction.reply('You must be in a voice channel to use this command');
			return;
		}

		const guildID = interaction.guildId!;

		await interaction.deferReply();

		const voice = new VoiceManager(guildID);

		const connected = await voice
			.join(member.voice.channelId)
			.catch(async (e: BotError) => {
				await interaction.reply(e.message);

				return false;
			})
			.then(() => true);

		if (!connected) return;

		if (url) {
			const song = await Controller.info(url as string).catch(async (error: BotError) => {
				if (error.type == ErrorType.NotFound) {
					await interaction.reply('Could not find a song with that url');

					return;
				}
			});

			if (!song) return;

			const embed = createEmbed(song);

			const player = new Player(guildID);

			player.add(song);

			if (player.isPlaying()) {
				embed.setTitle(`Added \`${song.name}\` to the queue`);
			} else {
				player.move('forward');

				voice.play(song);

				embed.setTitle(`Now playing \`${song.name}\``);
			}

			await interaction.followUp({ embeds: [embed], components: [createActionRow()] });

			return;
		}

		if (keywords) {
			const platform = interaction.options.get('platform')?.value;

			interaction.followUp(`Searching for \`${keywords}\``);

			await Controller.search(keywords.split(' '), platform as string);
		}

		return;
	}

	interaction.reply('Please provide a url or some keywords to search for');
};

const createActionRow = () =>
	new MessageActionRow().addComponents(
		new MessageButton().setStyle('PRIMARY').setLabel('Previous').setCustomId('previous-song'),
		new MessageButton().setStyle('PRIMARY').setLabel('Play/Pause').setCustomId('pause-song'),
		new MessageButton().setStyle('PRIMARY').setLabel('Next').setCustomId('next-song')
	);

const createEmbed = (song: Song) =>
	new DefaultEmbed()
		.addField('Platform', song.platform, true)
		.addField('Length', song.length.toString(), true)
		.addField('Artists', song.artists.join(', '), true);
