import { Playable } from '@models/player';

interface Song extends Playable {
	url: string;
	artwork: string;
	streamURL: string;
	streams?: number;
	likes?: number;
	name: string;
	platform: Platform;
	artists: string[];
	released: Date;
	length: number;
}

export interface UnresolvedSong extends Playable {
	resolve: () => Promise<Song>;
	identifier: string;
	platform: Platform;
}

export type Platform = 'soundcloud' | 'spotify' | 'file';

export default Song;
