import { GuildMember, MessageActionRow, MessageButton } from 'discord.js';

import Command from '@models/command';
import BotError, { ErrorType } from '@models/errors';
import { Playable } from '@models/player';
import Playlist from '@models/playlist';
import Song from '@models/song';

import * as Controller from '@utils/controller';
import { DefaultEmbed } from '@utils/embed';
import Player from '@utils/player';
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
				if (typeof e.message == 'string') {
					await interaction.reply(e.message);
				}

				return false;
			})
			.then(() => true);

		if (!connected) return;

		let playable: Playable | void;

		if (url) {
			playable = await Controller.info(url as string).catch(async (error: BotError) => {
				if (error.message == ErrorType.NotFound) {
					await interaction.reply('Could not find a song with that url');

					return;
				}
			});
		}

		if (keywords) {
			const platform = interaction.options.get('platform')?.value;

			interaction.followUp(`Searching for \`${keywords}\``);

			const songs = await Controller.search(keywords.split(' '), 1, platform as string);

			playable = songs[0];
		}

		if (!playable) return;

		if (playable.isSong()) {
			const embed = createSongEmbed(playable);

			const player = new Player(guildID);

			player.add(playable);

			if (player.isPlaying()) {
				embed.setTitle(`Added \`${playable.name}\` to the queue`);
			} else {
				player.move('forward');

				voice.play(playable);

				embed.setTitle(`Now playing \`${playable.name}\``);
			}

			await interaction.followUp({ embeds: [embed], components: [createActionRow()] });
		}

		if (playable.isPlaylist()) {
			if (playable.songs.length == 0) {
				await interaction.followUp('Playlist does not contain any songs');
				return;
			}

			const embed = createPlaylistEmbed(playable);

			const player = new Player(guildID);

			playable.songs.forEach((song) => player.add(song));

			const first = playable.songs.shift();

			if (!first) return;

			if (player.isPlaying()) {
				embed.setTitle(`Added \`${playable.name}\` to the queue`);
			} else {
				player.move('forward');

				voice.play(first);

				embed.setTitle(`Now playing \`${playable.name}\``);
			}

			await interaction.followUp({ embeds: [embed], components: [createActionRow()] });
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

const createSongEmbed = (song: Song) =>
	new DefaultEmbed()
		.addField('Length', secondsToReadable(song.length), true)
		.addField('Artists', song.artists.join(', '), true)
		.addField('Platform', capitalize(song.platform), true)
		.setThumbnail(song.artwork);

const createPlaylistEmbed = (playlist: Playlist) =>
	new DefaultEmbed()
		.addField('Length', secondsToReadable(playlist.total_length), true)
		.addField('Song count', playlist.songs.length.toString(), true)
		.addField('Created by', playlist.user.name, true)
		.addField('Platform', capitalize(playlist.platform), true)
		.setThumbnail(playlist.artwork);
