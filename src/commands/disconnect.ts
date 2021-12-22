import Command from '@models/command';
import BotError from '@models/errors';

import VoiceManager from '@utils/voice';

export const disconnect: Command = async (interaction) => {
	const guildID = interaction.guildId;

	const voice = new VoiceManager(guildID!);

	voice
		.disconnect()
		.then(async () => await interaction.reply('Disconnected from the voice channel'))
		.catch(async (e: BotError) =>
			typeof e.message == 'string' ? interaction.reply(e.message) : null
		);
};
