import { ColorResolvable, MessageEmbed } from 'discord.js';

import { BOT_COLOR } from '@global/config';

export class DefaultEmbed extends MessageEmbed {
	constructor() {
		super();

		this.setColor(BOT_COLOR as ColorResolvable);
		this.setTimestamp();
	}
}
