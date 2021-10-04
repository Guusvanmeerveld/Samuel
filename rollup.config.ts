import run from '@rollup/plugin-run';

import json from '@rollup/plugin-json';

import typescript from 'rollup-plugin-typescript';
import tsConfigPaths from 'rollup-plugin-ts-paths';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'cjs',
	},
	external: ['discord.js', 'dotenv', 'path', 'fs-extra', 'axios'],
	plugins: [dev && run(), json(), typescript(), tsConfigPaths()],
};
