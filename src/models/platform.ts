import Playlist from '@models/playlist';
import { UnresolvedSong } from '@models/song';

export type searcher = (keywords: string[], limit: number) => Promise<UnresolvedSong[] | void>;

export type getter = (url: string) => Promise<UnresolvedSong | Playlist>;
