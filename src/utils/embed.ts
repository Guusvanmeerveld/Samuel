import { MessageEmbed, User } from 'discord.js';

import { BOT_COLOR } from '@src/config';

export class DefaultEmbed extends MessageEmbed {
	constructor(author?: User) {
		super();

		if (author) {
			const avatarURL = author.avatarURL() as string;
			this.setAuthor(`Requested by ${author.username}`, avatarURL);
		}

		this.setColor(BOT_COLOR);
		this.setTimestamp();
	}
}
