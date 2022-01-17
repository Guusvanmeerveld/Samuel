import Document, { Html, Head, Main, NextScript } from 'next/document';

class AppDocument extends Document {
	render(): JSX.Element {
		return (
			<Html>
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap"
						rel="stylesheet"
					/>
					<link rel="icon" type="image/x-icon" href="/Tempo/favicon.ico"></link>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default AppDocument;
