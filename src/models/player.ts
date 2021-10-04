import Song from '@models/song';

interface Player {
	toPlay: Song[];
	hasPlayed: Song[];
	playing?: Song;
	loop: boolean;
	volume: number;
}

export default Player;
