import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import run from '@rollup/plugin-run';
import tsConfigPaths from 'rollup-plugin-ts-paths';
import typescript from 'rollup-plugin-typescript';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'cjs',
	},
	external: [
		'discord.js',
		'@discordjs/voice',
		'@discordjs/opus',
		'ioredis',
		'ffmpeg-static',
		'libsodium-wrappers',
	],
	plugins: [
		dev && run(),
		json(),
		typescript(),
		tsConfigPaths(),
		resolve({ preferBuiltins: false }),
		commonjs(),
	],
};
