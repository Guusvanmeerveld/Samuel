import {
	CommandInteraction,
	ContextMenuInteraction,
	GuildMember,
	MessageActionRow,
	MessageButton,
} from 'discord.js';

import BotError from '@models/errors';
import { Playable } from '@models/player';
import Playlist from '@models/playlist';
import Song from '@models/song';

import * as Controller from '@utils/controller';
import { DefaultEmbed } from '@utils/embed';
import Player from '@utils/player';
import VoiceManager from '@utils/voice';

import { MAX_QUEUE_LENGTH } from '@global/config';
import lang from '@global/lang';
import Command from '@global/models/command';

import { abbreviateNumber, capitalize, secondsToReadable } from '@src/utils';

export const play: Command = async (interaction) => {
	const url = interaction.options.get('url')?.value as string | undefined;
	const keywords = interaction.options.get('keywords')?.value as string | undefined;

	if (!(url || keywords)) {
		interaction.reply(lang.player.forgotKeywords);
		return;
	}

	await interaction.deferReply();

	execute(interaction, { url, keywords });
};

export const execute = async (
	interaction: CommandInteraction | ContextMenuInteraction,
	{ url, keywords }: { url?: string; keywords?: string }
): Promise<void> => {
	const member = interaction.member as GuildMember;

	if (!member.voice.channelId) {
		interaction.reply(lang.voice.memberNotConnected);
		return;
	}

	const guildID = interaction.guildId!;

	const voice = new VoiceManager(guildID);

	const connected = await voice
		.join(member.voice.channelId)
		.catch(async (e: BotError) => {
			await interaction.followUp(e.message);

			return false;
		})
		.then(() => true);

	if (!connected) return;

	let playable: Playable | void;

	if (keywords) {
		const platform = interaction.options.get('platform')?.value;

		interaction.followUp(lang.player.searching(keywords));

		const songs = await Controller.search(keywords.split(' '), 1, platform as string).catch(
			async (e: BotError) => {
				await interaction.followUp(e.message);

				return;
			}
		);

		if (!songs) return;

		playable = songs[0];
	}

	if (url) {
		playable = await Controller.info(url as string).catch(async (error: BotError) => {
			await interaction.followUp(error.message);

			return;
		});
	}

	if (!playable) return;

	if (playable.isSong()) {
		const song = await playable.resolve();

		const embed = createSongEmbed(song);

		const player = new Player(guildID);

		player.add(playable);

		if (player.isPlaying()) {
			embed.setTitle(lang.player.queue.added(song.name));
		} else {
			player.move('forward');

			voice.play(playable);

			embed.setTitle(lang.player.queue.nowPlaying(song.name));
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

		const { toPlay, hasPlayed, playing } = player.get();

		const queueLength = toPlay.length + hasPlayed.length + (playing ? 1 : 0);

		if (playable.songs.length + queueLength < MAX_QUEUE_LENGTH)
			playable.songs.forEach((song) => player.add(song));
		else {
			await interaction.followUp(lang.player.queue.full);
			return;
		}

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
		.addField(lang.embeds.play.streams, abbreviateNumber(song.streams ?? 0), true)
		.addField(lang.embeds.play.likes, abbreviateNumber(song.likes ?? 0), true)
		.addField(lang.embeds.play.length, secondsToReadable(song.length), true)
		.addField(lang.embeds.play.artists, song.artists.join(', '), true)
		.addField(lang.embeds.play.platform, capitalize(song.platform), true)
		.setURL(song.url)
		.setThumbnail(song.artwork);

const createPlaylistEmbed = (playlist: Playlist) =>
	new DefaultEmbed()
		.addField(lang.embeds.play.length, secondsToReadable(playlist.total_length), true)
		.addField(lang.embeds.play.songCount, playlist.songs.length.toString(), true)
		.addField(lang.embeds.play.createdBy, playlist.user.name, true)
		.addField(lang.embeds.play.platform, capitalize(playlist.platform), true)
		.setURL(playlist.url)
		.setThumbnail(playlist.artwork);
