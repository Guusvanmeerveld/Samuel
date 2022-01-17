import { NextPage } from 'next';

import Header from '@components/Header';
import Layout from '@components/Layout';

const Index: NextPage = () => (
	<Layout title="Home">
		<Header />
	</Layout>
);

export default Index;
