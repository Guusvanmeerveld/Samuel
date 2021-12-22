import { AudioPlayer } from '@discordjs/voice';

import Playlist from '@models/playlist';
import Song from '@models/song';

interface Player {
	controller: AudioPlayer;
	toPlay: Song[];
	hasPlayed: Song[];
	paused: boolean;
	playing?: Song;
	loop: boolean;
	volume: number;
}

export interface Playable {
	isPlaylist: () => this is Playlist;
	isSong: () => this is Song;
}

export default Player;
