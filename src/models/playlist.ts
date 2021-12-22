import Song, { Platform } from './song';

export default interface Playlist {
	isPlaylist: () => this is Playlist;
	isSong: () => this is Song;
	songs: Song[];
	url: string;
	artwork: string;
	name: string;
	platform: Platform;
	user: {
		name: string;
		avatar: string;
	};
	count: number;
	created: Date;
	total_length: number;
}
