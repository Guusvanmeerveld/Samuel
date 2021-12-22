import { Playable } from '@models/player';

interface Song extends Playable {
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
