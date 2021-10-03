import { ColorResolvable } from 'discord.js';

import { config } from 'dotenv';

import { join } from 'path';

config();

export const BOT_TOKEN = process.env.BOT_TOKEN;

export const CACHE_LOCATION = process.env.CACHE_LOCATION ?? join(process.cwd(), '.cache');

// Timeout in ms
export const CACHE_TIMEOUT = parseInt(process.env.CACHE_TIMEOUT as string) || 1000 * 60 * 5;

export const BOT_COLOR: ColorResolvable = (process.env.BOT_COLOR as ColorResolvable) ?? 'BLURPLE';
