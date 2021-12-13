import Song from '@models/song';

export type searcher = (keywords: string[]) => Promise<Song[]>;

export type getter = (url: string) => Promise<Song>;
