import { GuildMember, MessageActionRow, MessageButton } from 'discord.js';

import Command from '@models/command';
import BotError from '@models/errors';
import { Playable } from '@models/player';
import Playlist from '@models/playlist';
import Song from '@models/song';

import * as Controller from '@utils/controller';
import { DefaultEmbed } from '@utils/embed';
import Player from '@utils/player';
import VoiceManager from '@utils/voice';

import lang from '@src/lang';
import { capitalize, secondsToReadable } from '@src/utils';

export const play: Command = async (interaction) => {
	const url = interaction.options.get('url')?.value;
	const keywords = interaction.options.get('keywords')?.value as string;

	if (!(url || keywords)) {
		interaction.reply(lang.player.forgotKeywords);
		return;
	}

	const member = interaction.member as GuildMember;

	if (!member.voice.channelId) {
		interaction.reply(lang.voice.memberNotConnected);
		return;
	}

	const guildID = interaction.guildId!;

	await interaction.deferReply();

	const voice = new VoiceManager(guildID);

	const connected = await voice
		.join(member.voice.channelId)
		.catch(async (e: BotError) => {
			if (typeof e.message == 'string') {
				await interaction.followUp(e.message);
			}

			return false;
		})
		.then(() => true);

	if (!connected) return;

	let playable: Playable | void;

	if (url) {
		playable = await Controller.info(url as string).catch(async (error: BotError) => {
			await interaction.followUp(error.message);

			return;
		});
	}

	if (keywords) {
		const platform = interaction.options.get('platform')?.value;

		interaction.followUp(lang.player.searching(keywords));

		const songs = await Controller.search(keywords.split(' '), 1, platform as string);

		playable = songs[0];
	}

	if (!playable) return;

	if (playable.isSong()) {
		const embed = createSongEmbed(playable);

		const player = new Player(guildID);

		player.add(playable);

		if (player.isPlaying()) {
			embed.setTitle(lang.player.queue.added(playable.name));
		} else {
			player.move('forward');

			voice.play(playable);

			embed.setTitle(lang.player.queue.nowPlaying(playable.name));
		}

		await interaction.followUp({ embeds: [embed], components: [createActionRow()] });
	}

	if (playable.isPlaylist()) {
		if (playable.songs.length == 0) {
			await interaction.followUp(lang.player.playlistNoSongs);
			return;
		}

		const embed = createPlaylistEmbed(playable);

		const player = new Player(guildID);

		playable.songs.forEach((song) => player.add(song));

		const first = playable.songs.shift();

		if (!first) return;

		if (player.isPlaying()) {
			embed.setTitle(lang.player.queue.added(playable.name));
		} else {
			player.move('forward');

			voice.play(first);

			embed.setTitle(lang.player.queue.nowPlaying(playable.name));
		}

		await interaction.followUp({ embeds: [embed], components: [createActionRow()] });
	}
};

const createActionRow = () =>
	new MessageActionRow().addComponents(
		new MessageButton()
			.setStyle('PRIMARY')
			.setLabel(lang.buttons.previous)
			.setCustomId('previous-song'),
		new MessageButton()
			.setStyle('PRIMARY')
			.setLabel(lang.buttons.playpause)
			.setCustomId('pause-song'),
		new MessageButton().setStyle('PRIMARY').setLabel(lang.buttons.next).setCustomId('next-song')
	);

const createSongEmbed = (song: Song) =>
	new DefaultEmbed()
		.addField(lang.embeds.play.streams, song.streams?.toString() ?? 'Unknown', true)
		.addField(lang.embeds.play.likes, song.likes?.toString() ?? 'Unknown', true)
		.addField(lang.embeds.play.length, secondsToReadable(song.length), true)
		.addField(lang.embeds.play.artists, song.artists.join(', '), true)
		.addField(lang.embeds.play.platform, capitalize(song.platform), true)
		.setThumbnail(song.artwork);

const createPlaylistEmbed = (playlist: Playlist) =>
	new DefaultEmbed()
		.addField(lang.embeds.play.length, secondsToReadable(playlist.total_length), true)
		.addField(lang.embeds.play.songCount, playlist.songs.length.toString(), true)
		.addField(lang.embeds.play.createdBy, playlist.user.name, true)
		.addField(lang.embeds.play.platform, capitalize(playlist.platform), true)
		.setThumbnail(playlist.artwork);
