interface Song {
	url: string;
	name: string;
	platform: 'soundcloud';
	artists: string[];
	released: Date;
	length: number;
}

export default Song;
