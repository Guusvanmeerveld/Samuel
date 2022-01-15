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
