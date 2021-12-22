import Command from '@models/command';

import Player from '@utils/player';
import VoiceManager from '@utils/voice';

export const stop: Command = async (interaction) => {
	const guild = interaction.guild!;

	const voice = new VoiceManager(guild.id);

	const player = new Player(guild.id);

	const { playing } = player.get();

	if (voice.isConnected() && playing) {
		if (voice.stop()) {
			await interaction.reply('Stopped the music');
			return;
		}

		await interaction.reply('Failed to stop the music');
	}

	await interaction.reply('There is nothing playing');
};
