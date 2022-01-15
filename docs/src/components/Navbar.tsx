import styles from './Navbar.module.sass';

import Image from 'next/image';

import { FC } from 'react';
import { Container, Row } from 'react-bootstrap';

const Navbar: FC = () => (
	<nav className={styles.bar}>
		<Container>
			<Row>
				<Image src="logo.png" width={48} height={48} />
			</Row>
		</Container>
	</nav>
);

export default Navbar;
