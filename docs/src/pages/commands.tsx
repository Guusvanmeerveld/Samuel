import { GetStaticProps, NextPage } from 'next';

import { Container, Row } from 'react-bootstrap';

import Command from '@components/Command';
import Layout from '@components/Layout';

import * as Discord from '@utils/discord';

import { ApplicationCommand } from '@bot/models/command';

const Commands: NextPage<{ commands: ApplicationCommand[] }> = ({ commands }) => {
	return (
		<Layout title="Commands">
			<Container>
				<Row>
					<h1 className="mt-3 mb-0">List of commands</h1>
					{commands.map((command) => (
						<Command key={command.name} command={command} />
					))}
				</Row>
			</Container>
		</Layout>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	let commands = await Discord.commands();

	commands = commands.filter((command) => command.type == 1);

	return {
		props: { commands },
	};
};

export default Commands;
