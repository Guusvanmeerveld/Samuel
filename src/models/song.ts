interface Song {
	url: string;
	streamURL: string;
	name: string;
	platform: Platform;
	artists: string[];
	released: Date;
	length: number;
}

export type Platform = 'soundcloud' | 'spotify';

export default Song;
