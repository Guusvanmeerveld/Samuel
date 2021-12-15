import { ApplicationCommand, OptionType } from '@models/command';

const platformOption = {
	name: 'platform',
	description: 'The platform to find the song on',
	required: false,
	type: OptionType.STRING,
	choices: [
		{
			name: 'Soundcloud',
			value: 'soundcloud',
		},
		{
			name: 'Spotify',
			value: 'spotify',
		},
	],
};

const playOptions = [
	platformOption,
	{
		name: 'url',
		description: 'The songs url',
		required: false,
		type: OptionType.STRING,
	},
	{
		name: 'keywords',
		description: 'Keywords to search for a song',
		required: false,
		type: OptionType.STRING,
	},
];

const config: ApplicationCommand[] = [
	{
		name: 'help',
		description: 'Get information about a command or show a general list of commands.',
		options: [
			{
				name: 'page',
				description: 'Show a certain page in the list.',
				required: false,
				type: OptionType.NUMBER,
			},
			{
				name: 'command',
				description: 'Search for a specific command.',
				required: false,
				type: OptionType.STRING,
			},
		],
	},
	{
		name: 'disconnect',
		description: 'Disconnect the bot from the voice channel.',
	},
	{
		name: 'join',
		description: 'Make the bot join your voice channel.',
	},
	{
		name: 'stop',
		description: 'Stop the music.',
	},
	{
		name: 'pause',
		description: 'Pause the music.',
	},
	{
		name: 'resume',
		description: 'Resume the music.',
	},

	{
		name: 'skip',
		description: 'Skip through the queue.',
		options: [
			{
				name: 'count',
				description: 'The amount of songs to skip',
				required: false,
				type: OptionType.NUMBER,
			},
		],
	},
	{
		name: 'search',
		description: 'Search for a song',
		options: [
			{
				name: 'keywords',
				description: 'Keywords to search for',
				required: true,
				type: OptionType.STRING,
			},
			platformOption,
		],
	},
	{
		name: 'ping',
		description: 'Ping the bot to check the latency',
	},
	{
		name: 'playskip',
		description: 'Play a song ignoring the queue.',
		options: playOptions,
	},
	{
		name: 'play',
		description: 'Play a song in your current voice channel.',
		options: playOptions,
	},
];

export default config;
