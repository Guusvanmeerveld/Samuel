import { Playable } from '@models/player';
import Song, { Platform } from '@models/song';

export default interface Playlist extends Playable {
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
