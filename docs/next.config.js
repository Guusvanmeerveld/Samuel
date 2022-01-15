/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	images: {
		loader: 'imgix',
		path: 'https://tempo-bot.imgix.net/',
	},
};

module.exports = nextConfig;
