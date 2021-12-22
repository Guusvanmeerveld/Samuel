import Playlist from '@models/playlist';

interface Song {
	isPlaylist: () => this is Playlist;
	isSong: () => this is Song;
	url: string;
	artwork: string;
	streamURL: () => Promise<string>;
	name: string;
	platform: Platform;
	artists: string[];
	released: Date;
	length: number;
}

export type Platform = 'soundcloud' | 'spotify';

export default Song;
