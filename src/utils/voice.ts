import { Permissions } from 'discord.js';

import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';

import client from '@src/client';

export const join = async (
	guildID: string | null,
	channelID: string | null
): Promise<VoiceConnection | void> => {
	if (!channelID || !guildID) {
		return;
	}

	const guild = client.guilds.resolve(guildID);

	if (!guild) throw new Error('Invalid guild');

	const channel = guild.channels.resolve(channelID);

	if (channel?.isVoice()) {
		if (!channel) throw new Error('Invalid channel');

		const permissions = channel.permissionsFor(guild.me!);

		if (!permissions.has(Permissions.FLAGS.CONNECT)) {
			throw new Error('Not allowed to join voice channel');
		}

		return joinVoiceChannel({
			adapterCreator: guild.voiceAdapterCreator,
			channelId: channel.id,
			guildId: guild.id,
		});
	}
};
