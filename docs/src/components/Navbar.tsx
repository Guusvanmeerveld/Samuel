import styles from './Navbar.module.sass';

import Image from 'next/image';
import Link from 'next/link';

import { FC } from 'react';
import { Container } from 'react-bootstrap';
import { BsGithub } from 'react-icons/bs';
import { RiDiscordFill } from 'react-icons/ri';

const Navbar: FC = () => {
	return (
		<nav className={styles.bar}>
			<Container className="d-flex">
				<div className={styles.header}>
					<Image src="logo.png" width={48} height={48} />
					<p>Tempo</p>
				</div>
				<div className={styles.buttons}>
					<Link href={process.env.SERVER_INVITE_LINK ?? 'https://discord.gg'}>
						<a>
							<RiDiscordFill size={30} />
						</a>
					</Link>
					<Link href={process.env.REPO_LINK ?? 'https://github.com'}>
						<a>
							<BsGithub size={30} />
						</a>
					</Link>
				</div>
			</Container>
		</nav>
	);
};

export default Navbar;
