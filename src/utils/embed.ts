import { MessageEmbed } from 'discord.js';

import { BOT_COLOR } from '@src/config';

export class DefaultEmbed extends MessageEmbed {
	constructor() {
		super();

		this.setColor(BOT_COLOR);
		this.setTimestamp();
	}
}
