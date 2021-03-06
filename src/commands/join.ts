import { GuildMember } from 'discord.js';

import BotError from '@models/errors';

import VoiceManager from '@utils/voice';

import lang from '@global/lang';
import Command from '@global/models/command';

export const join: Command = async (interaction) => {
	const guildID = interaction.guildId;

	const member = interaction.member as GuildMember;

	const channel = member.voice?.channelId;

	if (!channel) {
		await interaction.reply(lang.voice.memberNotConnected);
		return;
	}

	const voice = new VoiceManager(guildID!);

	voice
		.join(channel)
		.then(async () => await interaction.reply(lang.voice.joined(member.voice.channel?.name)))
		.catch(async (e: BotError) => await interaction.reply(e.message));
};
