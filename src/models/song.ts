import { Playable } from '@models/player';

interface Song extends Playable {
	url: string;
	artwork: string;
	streamURL: () => Promise<string>;
	streams?: number;
	likes?: number;
	name: string;
	platform: Platform;
	artists: string[];
	released: Date;
	length: number;
}

export type Platform = 'soundcloud' | 'spotify' | 'file';

export default Song;
