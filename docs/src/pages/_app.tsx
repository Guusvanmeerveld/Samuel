import '@styles/global.sass';
import '@styles/vars.sass';

import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
	return <Component {...pageProps} />;
};

export default App;
