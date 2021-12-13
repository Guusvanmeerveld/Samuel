import run from '@rollup/plugin-run';

import json from '@rollup/plugin-json';

import typescript from 'rollup-plugin-typescript';
import tsConfigPaths from 'rollup-plugin-ts-paths';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'cjs',
	},
	external: ['discord.js', '@discordjs/opus', '@discordjs/voice', 'ioredis'],
	plugins: [
		dev && run(),
		json(),
		typescript(),
		tsConfigPaths(),
		resolve({ preferBuiltins: false }),
		commonjs(),
	],
};
