import { AudioPlayer } from '@discordjs/voice';

import Playlist from '@models/playlist';
import { UnresolvedSong } from '@models/song';

interface Player {
	controller: AudioPlayer;
	toPlay: UnresolvedSong[];
	hasPlayed: UnresolvedSong[];
	paused: boolean;
	playing?: UnresolvedSong;
	loop: boolean;
	volume: number;
}

export interface Playable {
	isPlaylist: () => this is Playlist;
	isSong: () => this is UnresolvedSong;
}

export default Player;
