import Command from '@models/command';
import BotError from '@models/errors';

import VoiceManager from '@utils/voice';

export const disconnect: Command = async (interaction) => {
	const guildID = interaction.guildId;

	const voice = new VoiceManager(guildID!);

	voice
		.disconnect()
		.catch(async (e: BotError) => interaction.reply(e.message))
		.then(async () => await interaction.reply('Disconnected from the voice channel'));
};
