import Playlist from '@models/playlist';
import Song from '@models/song';

export type searcher = (keywords: string[], limit: number) => Promise<Song[]>;

export type getter = (url: string) => Promise<Song | Playlist>;
