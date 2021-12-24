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
	};
	bot: {
		startup: (tag: string) => string;
		activity: {
			name: string;
		};
	};
	/**
	 * English only
	 */
	language: {
		notFound: (language: string) => string;
	};
	checks: {
		network: {
			status: string;
			success: string;
			error: (address: string) => string;
		};
		soundcloud: {
			notFound: string;
			status: string;
			success: string;
			error: string;
		};
	};
	redis: {
		connected: string;
		failed: string;
	};
}
