import Player from '@utils/player';
import VoiceManager from '@utils/voice';

import lang from '@global/lang';
import Command from '@global/models/command';

export const stop: Command = async (interaction) => {
	const guild = interaction.guild!;

	const voice = new VoiceManager(guild.id);

	const player = new Player(guild.id);

	const { playing } = player.get();

	if (voice.isConnected() && playing) {
		if (voice.stop()) {
			await interaction.reply(lang.player.stop.success);
			return;
		}

		await interaction.reply(lang.player.stop.failed);
	}

	await interaction.reply(lang.player.notPlaying);
};
