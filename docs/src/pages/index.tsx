import { NextPage } from 'next';

import { Button } from 'react-bootstrap';

import Header from '@components/Header';
import Layout from '@components/Layout';

const Index: NextPage = () => (
	<Layout>
		<Header />
		<Button>Hey</Button>
	</Layout>
);

export default Index;
