import * as Controller from '@utils/controller';

import BotError, { ErrorType } from '@models/errors';
import { GuildMember, MessageActionRow, MessageButton } from 'discord.js';

import Command from '@models/command';
import { DefaultEmbed } from '@utils/embed';
import Player from '@utils/player';
import Song from '@models/song';
import VoiceManager from '@utils/voice';
import { capitalize, secondsToReadable } from '@src/utils';

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

		let song: Song | void;

		if (url) {
			song = await Controller.info(url as string).catch(async (error: BotError) => {
				if (error.type == ErrorType.NotFound) {
					await interaction.reply('Could not find a song with that url');

					return;
				}
			});
		}

		if (keywords) {
			const platform = interaction.options.get('platform')?.value;

			interaction.followUp(`Searching for \`${keywords}\``);

			const songs = await Controller.search(keywords.split(' '), 1, platform as string);

			song = songs[0];
		}

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
		.addField('Platform', capitalize(song.platform), true)
		.addField('Length', secondsToReadable(song.length), true)
		.addField('Artists', song.artists.join(', '), true);
