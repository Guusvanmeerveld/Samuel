import styles from './Header.module.sass';

import Image from 'next/image';

import { FC } from 'react';

const Header: FC = () => (
	<div className="d-flex justify-center align-center">
		<Image className={styles.logo} src="banner.png" height={640} width={1280} />
	</div>
);

export default Header;
