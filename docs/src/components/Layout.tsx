import { DefaultSeo } from 'next-seo';

import { FC } from 'react';

import Navbar from '@components/Navbar';

import SEO from '@src/next-seo.config';

const Layout: FC<{ title: string }> = ({ children, title }) => (
	<>
		<DefaultSeo {...SEO} title={title} />
		<Navbar />
		{children}
	</>
);

export default Layout;
