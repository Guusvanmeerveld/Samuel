import Language from '@models/lang';

const UNKNOWN = 'Niks';

const nl: Language = {
	commands: {
		error: 'Er is een fout opgetreden bij het uitvoeren van uw commando :(',
		notFound: 'Dit commando bestaat niet.',
		updater: {
			updated: (commands) => `${commands} commando(s) geupdate`,
			error: 'Fout bij het updaten van commando(s):',
		},
		help: {
			command: {
				title: (commandName) => `Informatie voor commando \`${commandName}\``,
				description: (description) => `Omschrijving: \`${description}\``,
				options: 'Opties:',
				notFound: (search) => `Er zijn geen resultaten voor \`${search}\`.`,
			},
			list: {
				page: (page) => `\`${page}\` is geen bestaand pagina nummer.`,
				title: "Lijst van alle commando's",
				footer: (page, total) => `Pagina ${page}/${total}`,
				name: (name) => `Naam: \`${name}\``,
				description: (description) => `Omschrijving: \`${description}\``,
			},
		},
		ping: (time) => `Pong! in \`${time}ms\``,
	},
	song: {
		notFound: 'Nummer niet gevonden.',
	},
	voice: {
		memberNotConnected: 'Je bent niet verbonden met een spraak kanaal.',
		notConnected: 'Niet verbonden met een spraak kanaal.',
		alreadyConnected: (channel) => `Al verbonden met \`${channel}\``,
		notAllowedToJoin: 'Geen toestemming om je met je kanaal te verbinden',
		notAllowedToSpeak: 'Geen rechten om te spreken in je kanaal',
		disconnected: 'Verbinding met spraak kanaal verbroken.',
		joined: (channelName) => `Verbonden met \`${channelName ?? 'Unknown channel'}\`.`,
	},
	player: {
		paused: 'Huidig nummer gepauseerd.',
		resume: 'Huidig nummer hervat.',
		move: (skipped, current) =>
			`\`${skipped ?? UNKNOWN}\` overgeslagen,\`${current ?? UNKNOWN}\` speelt nu.`,
		stop: {
			success: 'Muziek gestopt',
			failed: 'Muziek kon niet worden gestopt',
		},
		notPlaying: 'Er wordt niets afgespeeld.',
		searching: (keywords) => `Zoeken naar \`${keywords}\``,
		playlistNoSongs: 'Deze afspeellijst bevat geen muziek',
		forgotKeywords: 'Vul een link of zoekterm in',
		queue: {
			added: (name) => `\`${name}\` toegevoegd aan wachtrij`,
			nowPlaying: (name) => `\`${name}\` speelt nu af`,
		},
	},
	bot: {
		startup: (userTag) => `Opgestart als ${userTag}`,
		activity: {
			name: '/help',
		},
	},
	checks: {
		network: {
			status: 'Netwerk check wordt uitgevoerd...',
			success: 'Netwerk check voltooid',
			error: (address) => `${address} kon niet worden bereikt, afbreken`,
		},
		soundcloud: {
			notFound: 'SOUNDCLOUD_TOKEN variable is niet gevonden, afbreken',
			status: 'SoundCloud token wordt gevalideerd...',
			success: 'SoundCloud token check voltooid',
			error: 'SoundCloud token kon niet worden gevalideerd, afbreken',
		},
	},
	redis: {
		connected: 'Verbonden met Redis db',
		failed: 'Verbinding met Redis db mislukt:',
	},
	buttons: {
		previous: 'Vorige',
		playpause: 'Play/Pauze',
		next: 'Volgende',
	},
	embeds: {
		streams: 'Streams',
		likes: 'Likes',
		length: 'Lengte',
		artists: 'Artiesten',
		platform: 'Platform',
		songCount: 'Nummer hoeveelheid',
		createdBy: 'Gemaakt door',
	},
};

export default nl;
