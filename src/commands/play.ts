import { GuildMember } from 'discord.js';

import Command from '@models/command';
import BotError, { ErrorType } from '@models/errors';

import VoiceManager from '@utils/voice';

import * as Controller from '@utils/controller';
import { DefaultEmbed } from '@utils/embed';

import Player from '@utils/player';
import { VoiceConnection } from '@discordjs/voice';

export const play: Command = async (interaction) => {
	const url = interaction.options.get('url')?.value;
	const keywords = interaction.options.get('keywords')?.value;

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
			.catch(async () => {
				await interaction.reply('Could not connect to your voice channel');

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

			const embed = new DefaultEmbed().addField('Length', song.length.toString());

			const player = new Player(guildID);

			player.add(song);

			if (player.isPlaying()) {
				embed.setTitle(`Added \`${song.name}\` to the queue`);
			} else {
				player.next();

				voice.play(song, { onIdle });

				embed.setTitle(`Now playing \`${song.name}\``);
			}

			await interaction.followUp({ embeds: [embed] });

			return;
		}

		return;
	}

	interaction.reply('Please provide a url or some keywords to search for');
};

const onIdle = (connection: VoiceConnection, guildID: string) => {
	const player = new Player(guildID);

	player.next();

	const { playing } = player.get();

	if (!playing) {
		connection.disconnect();
		return;
	}

	const voice = new VoiceManager(guildID);

	voice.play(playing, { onIdle });
};
