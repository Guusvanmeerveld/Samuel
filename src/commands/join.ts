import { GuildMember } from 'discord.js';

import Command from '@models/command';
import BotError from '@models/errors';

import VoiceManager from '@utils/voice';

export const join: Command = async (interaction) => {
	const guildID = interaction.guildId;

	const member = interaction.member as GuildMember;

	const channel = member.voice.channelId!;

	if (!channel) {
		await interaction.reply('You are not connected to a voice channel');
		return;
	}

	const voice = new VoiceManager(guildID!);

	voice
		.join(channel)
		.then(
			async () =>
				await interaction.reply(
					`Succesfully joined \`${member.voice.channel?.name ?? 'Unknown channel'}\``
				)
		)
		.catch(async (e: BotError) =>
			typeof e.message == 'string' ? await interaction.reply(e.message) : null
		);
};
