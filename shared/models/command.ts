import { CommandInteraction } from 'discord.js';

type Command = (interaction: CommandInteraction) => Promise<void>;

export default Command;

export enum ApplicationCommandType {
	CHAT_INPUT = 1,
	USER = 2,
	MESSAGE = 3,
}

export interface ApplicationCommand {
	name: string;
	description?: string;
	options?: Option[];
	type?: ApplicationCommandType;
}

export interface Option {
	name: string;
	description: string;
	required?: boolean;
	choices?: Choice[];
	type: OptionType;
}

export enum OptionType {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
	NUMBER = 10,
}

export interface Choice {
	name: string;
	value: string | number;
}
