import Collection from '@discordjs/collection';
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice';

import BotError from '@models/errors';
import PlayerModel from '@models/player';
import { UnresolvedSong } from '@models/song';

import VoiceManager from '@utils/voice';

import lang from '@src/lang';

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
	 * @param identifer The identifier of the song
	 * @returns If the song is in the queue
	 */
	has = (identifier: string): boolean => {
		const player = this.get();

		const song =
			player?.toPlay.find((song) => song.identifier == identifier) ??
			player?.hasPlayed.find((song) => song.identifier == identifier);

		return song != undefined;
	};

	/**
	 * Adds a song to the queue.
	 * @param song The song to add
	 */
	add = (song: UnresolvedSong): void => {
		const player = this.get();

		player?.toPlay.push(song);
	};

	/**
	 * Searches for a song by its identifier and remove it.
	 * @param identifier The identifier to search for
	 */
	remove = (identifier: string): void => {
		const player = this.get();

		player?.toPlay.filter((song) => song.identifier != identifier);
	};

	/**
	 *
	 */
	pause = async (toggle = true, pause?: boolean): Promise<boolean> => {
		const player = this.get();

		if (!player.playing) throw new BotError(lang.player.notPlaying);

		if (toggle) {
			player.paused = !player.paused;
		}

		if (!toggle && pause != undefined) {
			player.paused = pause;
		}

		player.paused ? player.controller.pause() : player.controller.unpause();

		return player.paused;
	};

	/**
	 * Stops playing the current song
	 */
	stop = async (): Promise<void> => {
		const { playing, controller } = this.get();

		if (!playing) throw new BotError(lang.player.notPlaying);

		controller.stop();
	};

	/**
	 * Shift the queue in a certain direction
	 */
	move = (
		direction: 'forward' | 'back'
	): [previous: string | undefined, current: string | undefined] => {
		const voice = new VoiceManager(this.guildID);

		if (!voice.isConnected()) {
			throw new BotError(lang.voice.notConnected);
		}

		const player = this.get();

		let newPlaying: UnresolvedSong | undefined;

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

			return [old?.identifier, undefined];
		}

		voice.play(player.playing);

		return [old?.identifier, player.playing.identifier];
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
