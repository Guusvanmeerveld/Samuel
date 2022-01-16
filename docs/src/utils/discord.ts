import axios from 'axios';

import { ApplicationCommand } from '@bot/models/command';

const request = axios.create({
	baseURL: 'https://discord.com/api/v9/',
	headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
	method: 'GET',
});

export const commands = async (): Promise<ApplicationCommand[]> => {
	const { data } = await request(`/applications/${process.env.APPLICATION_ID}/commands`, {
		validateStatus: () => true,
	});

	return data;
};
