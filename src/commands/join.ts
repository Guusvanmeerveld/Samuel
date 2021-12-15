import { GuildMember } from 'discord.js';

import BotError from '@models/errors';
import Command from '@models/command';

import VoiceManager from '@utils/voice';

export const join: Command = async (interaction) => {
	const guildID = interaction.guildId;

	const member = interaction.member as GuildMember;

	const channel = member.voice.channelId!;

	const voice = new VoiceManager(guildID!);

	voice
		.join(channel)
		.catch(async (e: BotError) => interaction.reply(e.message))
		.then(
			async () =>
				await interaction.reply(
					`Succesfully joined \`${member.voice.channel?.name ?? 'Unknown channel'}\``
				)
		);
};
