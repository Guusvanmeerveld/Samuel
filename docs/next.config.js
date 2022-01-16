const querystring = require('querystring');

const inviteCode = 'v5Wx9RARGx';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	images: {
		loader: 'imgix',
		path: 'https://tempo-bot.imgix.net/',
	},
	env: {
		BOT_INVITE_LINK: () => {
			const url = new URL('https://discord.com');

			url.pathname = '/api/oauth2/authorize';

			url.search = querystring.stringify({
				client_id: '747185867092787210',
				permissions: 3147776,
				scope: ['bot'].join(' '),
			});

			return url.href;
		},
		SERVER_INVITE_LINK: `https://discord.gg/${inviteCode}`,
		REPO_LINK: 'https://github.com/Guusvanmeerveld/Tempo',
	},
	basePath: '/Tempo',
};

module.exports = nextConfig;
