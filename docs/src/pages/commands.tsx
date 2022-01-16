import { GetStaticProps, NextPage } from 'next';

import Layout from '@components/Layout';

import * as Discord from '@utils/discord';

import { ApplicationCommand } from '@bot/models/command';

const Commands: NextPage<{ commands: ApplicationCommand[] }> = ({ commands }) => {
	return <Layout>{commands.map((command) => command.name)}</Layout>;
};

export const getStaticProps: GetStaticProps = async () => {
	let commands = await Discord.commands();

	commands = commands.filter((command) => command.type == 1);

	return {
		props: { commands },
	};
};

export default Commands;
