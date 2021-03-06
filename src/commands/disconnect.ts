import BotError from '@models/errors';

import VoiceManager from '@utils/voice';

import lang from '@global/lang';
import Command from '@global/models/command';

export const disconnect: Command = async (interaction) => {
	const guildID = interaction.guildId;

	const voice = new VoiceManager(guildID!);

	voice
		.disconnect()
		.then(async () => await interaction.reply(lang.voice.disconnected))
		.catch(async (e: BotError) => await interaction.reply(e.message));
};
