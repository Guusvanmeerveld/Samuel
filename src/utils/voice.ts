import { Permissions } from 'discord.js';

import m3u8stream from 'm3u8stream';

import {
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
	VoiceConnection,
} from '@discordjs/voice';

import Player from '@utils/player';

import * as Logger from '@utils/logger';

import BotError, { ErrorType } from '@models/errors';
import Song from '@models/song';

import client from '@src/client';

type AudioStream = m3u8stream.Stream;

export default class VoiceManager {
	private player: Player;

	private connection?: VoiceConnection;

	constructor(private guildID: string) {
		this.player = new Player(guildID);

		this.connection = getVoiceConnection(guildID);
	}

	public join = async (channelID: string | null): Promise<void> => {
		if (!channelID || !this.guildID) {
			return;
		}

		const guild = client.guilds.resolve(this.guildID);

		if (!guild) throw new BotError('Invalid guild');

		const channel = guild.channels.resolve(channelID);

		if (channel?.isVoice()) {
			if (!channel) throw new BotError('Invalid channel');

			const permissions = channel.permissionsFor(guild.me!);

			if (!permissions.has(Permissions.FLAGS.CONNECT)) {
				throw new BotError('Not allowed to join voice channel');
			}

			this.connection = joinVoiceChannel({
				adapterCreator: guild.voiceAdapterCreator,
				channelId: channel.id,
				guildId: guild.id,
			});

			if (!this.connection) {
				throw new BotError('Not connected to any voice channel', ErrorType.VoiceNotConnected);
			}
		}
	};

	public volume = async (volume: number): Promise<void> => {
		const { controller } = this.player.get();
	};

	public disconnect = async (): Promise<void> => {
		if (!this.connection)
			throw new BotError('Not connected to any voice channel', ErrorType.VoiceNotConnected);

		this.connection?.disconnect();
	};

	public play = (
		song: Song,
		{ onIdle }: { onIdle: (connection: VoiceConnection, guildID: string) => void }
	): void => {
		if (!this.connection) {
			throw new BotError('Not connected to any voice channel', ErrorType.VoiceNotConnected);
		}

		let stream: AudioStream | undefined;

		if (song.platform == 'soundcloud') {
			stream = m3u8stream(song.streamURL);
		}

		if (!stream) throw new BotError('Could not fetch remote audio stream', ErrorType.NotFound);

		const { controller } = this.player.get();

		const resource = createAudioResource(stream, { inlineVolume: true });

		controller.play(resource);

		this.connection.subscribe(controller);

		controller.on('error', (error) => Logger.error('Error playing song: ' + error));

		controller.on(AudioPlayerStatus.Idle, () => onIdle(this.connection!, this.guildID));
	};
}
