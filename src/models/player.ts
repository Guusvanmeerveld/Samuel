import { AudioPlayer } from '@discordjs/voice';

import Song from '@models/song';
import Playlist from '@models/playlist';

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
