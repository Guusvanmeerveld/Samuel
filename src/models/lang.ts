export default interface Language {
	commands: {
		error: string;
		notFound: string;
		updater: {
			updated: (commands: number) => string;
			error: string;
		};
		help: {
			command: {
				title: (commandName: string) => string;
				description: (description: string) => string;
				options: string;
				notFound: (search: string) => string;
			};
			list: {
				page: (pageNumber: number) => string;
				title: string;
				footer: (page: number, total: number) => string;
				name: (commandName: string) => string;
				description: (description: string) => string;
			};
		};
		ping: (time: number) => string;
	};
	song: {
		notFound: string;
		errorFetchingFile: string;
		noAttatchments: string;
	};
	voice: {
		memberNotConnected: string;
		notConnected: string;
		alreadyConnected: (channelName: string) => string;
		notAllowedToJoin: string;
		notAllowedToSpeak: string;
		disconnected: string;
		joined: (channelName?: string) => string;
	};
	player: {
		paused: string;
		resume: string;
		move: (skipped?: string, current?: string) => string;
		stop: {
			success: string;
			failed: string;
		};
		notPlaying: string;
		searching: (keywords: string) => string;
		playlistNoSongs: string;
		forgotKeywords: string;
		queue: {
			added: (name: string) => string;
			nowPlaying: (name: string) => string;
			full: string;
		};
	};
	bot: {
		startup: (tag: string) => string;
		activity: {
			name: string;
		};
		noPrivateMessages: string;
	};
	/**
	 * English only
	 */
	language?: {
		notFound: (language: string) => string;
	};
	checks: {
		network: {
			status: string;
			success: string;
			error: (address: string) => string;
		};
		soundcloud: {
			fetching: {
				status: string;
				failed: string;
				success: string;
			};
			status: string;
			success: string;
			error: string;
		};
	};
	redis: {
		connected: string;
		failed: string;
	};
	buttons: {
		previous: string;
		playpause: string;
		next: string;
	};
	embeds: {
		play: {
			streams: string;
			likes: string;
			length: string;
			artists: string;
			platform: string;
			songCount: string;
			createdBy: string;
		};
		search: {
			title: (keywords: string) => string;
		};
	};
}
