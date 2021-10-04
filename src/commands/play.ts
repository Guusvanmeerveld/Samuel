import { GuildMember } from 'discord.js';

import Command from '@models/command';

// import * as Soundcloud from '@utils/soundcloud';

import * as VoiceManager from '@utils/voice';

export const play: Command = async (interaction) => {
	const url = interaction.options.get('url');
	const keywords = interaction.options.get('keywords');

	if (url || keywords) {
		const member = interaction.member as GuildMember;

		if (!member.voice.channelId) {
			interaction.reply('You must be in a voice channel to use this command');
			return;
		}

		const connection = VoiceManager.join(interaction.guildId, member.voice.channelId);

		console.log(connection);

		return;
	}

	interaction.reply('Please provide a url or some keywords to search for');
};
