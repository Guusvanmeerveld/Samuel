import BotError from '@models/errors';
import Command from '@models/command';

import VoiceManager from '@utils/voice';

export const disconnect: Command = async (interaction) => {
	const guildID = interaction.guildId;

	const voice = new VoiceManager(guildID!);

	voice
		.disconnect()
		.catch(async (e: BotError) => interaction.reply(e.message))
		.then(() => interaction.reply('Disconnected from the voice channel'));
};
