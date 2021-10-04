import Collection from '@discordjs/collection';

import Song from '@models/song';
import Player from '@models/player';

const GlobalPlayer = new Collection<string, Player>();

export const init = (guildID: string): Player => {
	const initial = { volume: 100, loop: false, toPlay: [], hasPlayed: [] };

	GlobalPlayer.set(guildID, initial);

	return initial;
};

export const unset = (guildID: string): boolean => GlobalPlayer.delete(guildID);

export const has = (guildID: string, url: string): boolean => {
	const player = GlobalPlayer.get(guildID);

	const song =
		player?.toPlay.find((song) => song.url == url) ??
		player?.hasPlayed.find((song) => song.url == url);

	return song != undefined;
};

export const add = (guildID: string, song: Song): void => {
	const player = GlobalPlayer.get(guildID);

	player?.toPlay.push(song);
};

export const remove = (guildID: string, url: string): void => {
	const player = GlobalPlayer.get(guildID);

	player?.toPlay.filter((song) => song.url != url);
};

export const next = (guildID: string): void => {
	let player = GlobalPlayer.get(guildID);

	if (!player) {
		player = init(guildID);
	}

	const newPlaying = player?.toPlay.shift();

	if (player?.playing) {
		player?.hasPlayed.push(player.playing);
	}

	player.playing = newPlaying;

	console.log(player);
};

export const previous = (guildID: string): void => {
	let player = GlobalPlayer.get(guildID);

	if (!player) {
		player = init(guildID);
	}

	const newPlaying = player?.hasPlayed.pop();

	if (player?.playing) {
		player?.toPlay.unshift(player.playing);
	}

	player.playing = newPlaying;

	console.log(player);
};
