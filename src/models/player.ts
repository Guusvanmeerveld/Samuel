import { AudioPlayer } from '@discordjs/voice';
import Song from '@models/song';

interface Player {
	controller: AudioPlayer;
	toPlay: Song[];
	hasPlayed: Song[];
	playing?: Song;
	loop: boolean;
	volume: number;
}

export default Player;
