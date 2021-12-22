import Collection from '@discordjs/collection';
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice';

import BotError, { ErrorType } from '@models/errors';
import PlayerModel from '@models/player';
import Song from '@models/song';

import VoiceManager from '@utils/voice';

const GlobalPlayerModel = new Collection<string, PlayerModel>();

export default class Player {
	constructor(private guildID: string) {}

	/**
	 * Inits a player for a guild
	 * @returns The initialized player
	 */
	init = (): PlayerModel => {
		const controller = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		const initial = {
			controller,
			volume: 100,
			loop: false,
			paused: false,
			toPlay: [],
			hasPlayed: [],
		};

		GlobalPlayerModel.set(this.guildID, initial);

		return initial;
	};

	/**
	 * Retrieves the player for the current guild.
	 * @returns The player
	 */
	get = (): PlayerModel => {
		let player = GlobalPlayerModel.get(this.guildID);

		if (!player) {
			player = this.init();
		}

		return player;
	};

	/**
	 * Deletes guild from global player.
	 */
	unset = (): boolean => GlobalPlayerModel.delete(this.guildID);

	/**
	 * Checks if a song is in the queue.
	 * @param url The url of the song
	 * @returns If the song is in the queue
	 */
	has = (url: string): boolean => {
		const player = this.get();

		const song =
			player?.toPlay.find((song) => song.url == url) ??
			player?.hasPlayed.find((song) => song.url == url);

		return song != undefined;
	};

	/**
	 * Adds a song to the queue.
	 * @param song The song to add
	 */
	add = (song: Song): void => {
		const player = this.get();

		player?.toPlay.push(song);
	};

	/**
	 * Searches for a song by its url and remove it.
	 * @param url The url to search for
	 */
	remove = (url: string): void => {
		const player = this.get();

		player?.toPlay.filter((song) => song.url != url);
	};

	/**
	 *
	 */
	pause = (): boolean => {
		const player = this.get();

		if (!player.playing) throw new BotError('There is nothing playing right now.');

		player.paused = !player.paused;

		player.paused ? player.controller.pause() : player.controller.unpause();

		return player.paused;
	};

	/**
	 * Stops playing the current song
	 */
	stop = async (): Promise<void> => {
		const { playing, controller } = this.get();

		if (!playing) throw new BotError('There is nothing playing right now.');

		controller.stop();
	};

	/**
	 * Shift the queue in a certain direction
	 */
	move = (direction: 'forward' | 'back'): [old: string | void, current: string | void] => {
		const voice = new VoiceManager(this.guildID);

		if (!voice.isConnected()) {
			throw new BotError(ErrorType.VoiceNotConnected);
		}

		const player = this.get();

		let newPlaying: Song | undefined;

		if (direction == 'forward') newPlaying = player?.toPlay.shift();
		if (direction == 'back') newPlaying = player?.hasPlayed.pop();

		const old = player.playing;

		if (player.playing) {
			if (direction == 'back') player.toPlay.unshift(player.playing);
			if (direction == 'forward') player.hasPlayed.push(player.playing);
		}

		player.playing = newPlaying;

		if (!player.playing) {
			voice.disconnect();

			return [old?.name, undefined];
		}

		voice.play(player.playing);

		return [old?.name, player.playing.name];
	};

	/**
	 * Checks if the player is playing something.
	 * @returns Wether the player is playing
	 */
	isPlaying = (): boolean => {
		const player = this.get();

		return player?.playing != undefined;
	};
}
