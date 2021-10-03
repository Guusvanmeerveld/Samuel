import { ApplicationCommand, OptionType } from '@models/command';

const config: ApplicationCommand[] = [
	{
		name: 'help',
		description: 'Get information about a command.',
		options: [
			{
				name: 'page',
				description: 'The page to show',
				required: false,
				type: OptionType.NUMBER,
			},
			{
				name: 'command',
				description: 'The command to show information for',
				required: false,
				type: OptionType.STRING,
			},
		],
	},
];

export default config;
