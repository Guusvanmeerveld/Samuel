import styles from './Header.module.sass';

import Image from 'next/image';

import { FC } from 'react';
import { Button, Container, Row } from 'react-bootstrap';

const Header: FC = () => (
	<div className="d-flex justify-center align-center">
		<Container>
			<Row className={styles.container}>
				<Image className={styles.logo} src="banner.png" height={320} width={640} />
			</Row>
			<Row className={styles.buttons}>
				<Button>Invite to Server</Button>
				<Button>Hey</Button>
			</Row>
		</Container>
	</div>
);

export default Header;
