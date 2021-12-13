import { createAudioPlayer, NoSubscriberBehavior } from '@discordjs/voice';
import Collection from '@discordjs/collection';

import Song from '@models/song';
import PlayerModel from '@models/player';

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

		const initial = { controller, volume: 100, loop: false, toPlay: [], hasPlayed: [] };

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
	 * Plays the next song in the queue.
	 */
	next = (): void => {
		const player = this.get();

		const newPlaying = player?.toPlay.shift();

		if (player.playing) {
			player.hasPlayed.push(player.playing);
		}

		player.playing = newPlaying;
	};

	/**
	 * Plays the previous song in the queue.
	 */
	previous = (): void => {
		const player = this.get();

		const newPlaying = player?.hasPlayed.pop();

		if (player.playing) {
			player.toPlay.unshift(player.playing);
		}

		player.playing = newPlaying;
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
