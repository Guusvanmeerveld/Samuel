import { ContextMenuInteraction } from 'discord.js';

import lang from '@global/lang';

import * as play from '@src/commands/play';

const handleContextMenu = async (interaction: ContextMenuInteraction): Promise<void> => {
	const message = interaction.channel?.messages.resolve(interaction.targetId);

	if (!message?.attachments.first()) {
		interaction.reply(lang.song.noAttatchments);
		return;
	}

	const url = message.attachments.first()?.url;

	play.execute(interaction, { url });
};

export default handleContextMenu;
