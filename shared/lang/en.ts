import Language from '@models/lang';

const UNKNOWN = 'Nothing';

const en: Language = {
	commands: {
		error: 'An error occurred while processing your command :(',
		notFound: 'Could not find that command.',
		updater: {
			updated: (commands) => `Updated ${commands} command(s)`,
			error: 'Failed to update commands:',
		},
		help: {
			command: {
				title: (commandName) => `Showing info for the command \`${commandName}\``,
				description: (description) => `Description: \`${description}\``,
				options: 'Options:',
				notFound: (search) => `Could not find a command matching \`${search}\`.`,
			},
			list: {
				page: (page) => `\`${page}\` is not a valid page number.`,
				title: 'Showing a list of all commands',
				footer: (page, total) => `Page ${page}/${total}`,
				name: (name) => `Name: \`${name}\``,
				description: (description) => `Description: \`${description}\``,
			},
		},
		ping: (time) => `Pong! took \`${time}ms\``,
	},
	song: {
		notFound: 'Could not find song.',
		errorFetchingFile: 'An error occured while fetching your file',
		noAttatchments: 'Message does not have any attatchments',
	},
	voice: {
		memberNotConnected: 'You are not connected to a voice channel.',
		notConnected: 'Not connected to any voice channel.',
		alreadyConnected: (channel) => `Already connected to \`${channel}\``,
		notAllowedToJoin: 'Not allowed to join your voice channel',
		notAllowedToSpeak: 'Not allowed to speak in your voice channel',
		disconnected: 'Disconnected from the voice channel.',
		joined: (channelName) => `Succesfully joined \`${channelName ?? 'Unknown channel'}\`.`,
	},
	player: {
		paused: 'Paused the current song.',
		resume: 'Resumed the current song.',
		move: (skipped, current) =>
			`Skipped \`${skipped ?? UNKNOWN}\`, started playing \`${current ?? UNKNOWN}\`.`,
		stop: {
			success: 'Stopped the music',
			failed: 'Failed to stop the music',
		},
		notPlaying: 'There is nothing playing.',
		searching: (keywords) => `Searching for \`${keywords}\``,
		playlistNoSongs: 'Playlist does not contain any songs',
		forgotKeywords: 'Please provide a url or some keywords to search for',
		queue: {
			added: (name) => `Added ${name} to the queue`,
			nowPlaying: (name) => `Now playing: ${name}`,
			full: 'The queue is too full to add any more songs.',
		},
	},
	bot: {
		startup: (userTag) => `Started up client ${userTag}`,
		activity: {
			name: '/help',
		},
		noPrivateMessages: 'Sorry, but Tempo does not support commands in private messages.',
	},
	language: {
		notFound: (language) => `Could not find language ${language}, exiting...`,
	},
	checks: {
		network: {
			status: 'Checking network status...',
			success: 'Network check succeeded',
			error: (address) => `Could not ping ${address}, stopping`,
		},
		soundcloud: {
			fetching: {
				status: 'Fetching new Soundcloud token',
				failed: 'Failed to fetch new Soundcloud token',
				success: 'Fetched new Soundcloud token',
			},
			status: 'Validating SoundCloud token...',
			success: 'SoundCloud token check succeeded',
			error: 'Could not validate SoundCloud token, stopping',
		},
	},
	redis: {
		connected: 'Connected with Redis db',
		failed: 'Failed to connect to Redis db:',
	},
	buttons: {
		previous: 'Previous',
		playpause: 'Play/Pause',
		next: 'Next',
	},
	embeds: {
		play: {
			streams: 'Streams',
			likes: 'Likes',
			length: 'Length',
			artists: 'Artists',
			platform: 'Platform',
			songCount: 'Song Count',
			createdBy: 'Created By',
		},
		search: { title: (keywords) => `Showing results for \`${keywords}\`` },
	},
};

export default en;
