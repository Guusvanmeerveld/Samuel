import styles from './Header.module.sass';

import Image from 'next/image';
import Link from 'next/link';

import { FC } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const Header: FC = () => (
	<div className="d-flex justify-center align-center">
		<Container>
			<Row className={styles.container}>
				<Image className={styles.logo} src="banner.png" height={320} width={640} />
			</Row>
			<Row className={styles.buttons}>
				<Col className={styles.button}>
					<Link href={process.env.BOT_INVITE_LINK ?? 'https://discord.gg'}>
						<a>
							<Button>Invite to Server</Button>
						</a>
					</Link>
				</Col>
				<Col className={styles.button}>
					<Link href="/commands">
						<a>
							<Button>List of commands</Button>
						</a>
					</Link>
				</Col>
			</Row>
		</Container>
	</div>
);

export default Header;
