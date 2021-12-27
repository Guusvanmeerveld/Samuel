import m3u8stream from 'm3u8stream';

import { Permissions } from 'discord.js';

import {
	AudioPlayerStatus,
	VoiceConnection,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';

import BotError from '@models/errors';
import Song from '@models/song';

import * as Logger from '@utils/logger';
import Player from '@utils/player';

import client from '@src/client';
import lang from '@src/lang';

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

		if (!channel) throw new BotError('Invalid channel');

		if (this.isConnected() && this.connection?.joinConfig.channelId == channelID) {
			throw new BotError(lang.voice.alreadyConnected(channel.name));
		}

		if (channel?.isVoice()) {
			const permissions = channel.permissionsFor(guild.me!);

			if (!permissions.has(Permissions.FLAGS.CONNECT)) {
				throw new BotError(lang.voice.notAllowedToJoin);
			}

			if (!permissions.has(Permissions.FLAGS.SPEAK)) {
				throw new BotError(lang.voice.notAllowedToSpeak);
			}

			this.connection = joinVoiceChannel({
				adapterCreator: guild.voiceAdapterCreator,
				channelId: channel.id,
				guildId: guild.id,
			});

			if (!this.connection) {
				throw new BotError(lang.voice.notConnected);
			}

			this.connection.on('stateChange', (oldState, newState) => {
				if (newState.status == 'disconnected') {
					this.player.unset();
				}
			});
		}
	};

	public isConnected = (): boolean => {
		return getVoiceConnection(this.guildID) != undefined;
	};

	// public volume = async (volume: number): Promise<void> => {
	// 	const { controller } = this.player.get();
	// };

	public disconnect = async (): Promise<void> => {
		if (!this.connection) throw new BotError(lang.voice.notConnected);

		this.connection.destroy();
	};

	public stop = (): boolean => {
		const { controller } = this.player.get();

		return controller.stop();
	};

	public play = async (song: Song, onIdle = this.defaultOnIdle): Promise<void> => {
		if (!this.connection) {
			throw new BotError(lang.voice.notConnected);
		}

		let stream: AudioStream | undefined;

		switch (song.platform) {
			case 'soundcloud':
				stream = m3u8stream(await song.streamURL());

				break;
		}

		if (!stream) throw new BotError(lang.song.notFound);

		const { controller } = this.player.get();

		const resource = createAudioResource(stream, { inlineVolume: true });

		controller.play(resource);

		this.connection.subscribe(controller);

		controller.on('error', (error) => Logger.error('Error playing song: ' + error));

		controller.on(AudioPlayerStatus.Idle, () => onIdle(this.connection!, this.guildID));
	};

	private defaultOnIdle = (connection: VoiceConnection, guildID: string) => {
		const player = new Player(guildID);

		if (this.isConnected()) player.move('forward');
	};
}
