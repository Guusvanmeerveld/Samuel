import { NextPage } from 'next';

import { Container } from 'react-bootstrap';

import Layout from '@components/Layout';

const Index: NextPage = () => (
	<Layout>
		<Container>
			<h1 className="mt-5">Page not found</h1>
			<h4>The page has been removed or doesn't exist.</h4>
		</Container>
	</Layout>
);

export default Index;
