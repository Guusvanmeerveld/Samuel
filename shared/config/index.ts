import { config } from 'dotenv';
import { join } from 'path';

config();

/**
 * @required
 */
export const BOT_TOKEN = process.env.BOT_TOKEN;

/**
 * @optional
 * @description The Discord API version the bot will make requests to.
 */
export const DISCORD_API_VERSION = process.env.DISCORD_API_VERSION ?? '9';

/**
 * @optional
 * @description The color the bot will use for embeds.
 */
export const BOT_COLOR = process.env.BOT_COLOR ?? 'BLURPLE';

/**
 * @optional
 * @description The cache directory.
 */
export const CACHE_LOCATION = process.env.CACHE_LOCATION ?? join(process.cwd(), '.cache');

/**
 * @optional
 * @description Timeout in ms
 */
export const CACHE_TIMEOUT = parseInt(process.env.CACHE_TIMEOUT as string) || 1000 * 60 * 5;

/**
 * @required
 */
export const REDIS_URL = process.env.REDIS_URL;

/**
 * @optional
 */
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

/**
 * @optional
 */
export const REDIS_USER = process.env.REDIS_USER;

/**
 * @required
 */
export const SOUNDCLOUD_TOKEN = process.env.SOUNDCLOUD_TOKEN;

/**
 * @optional
 */
export const PING_ADDRESS = process.env.PING_ADDRESS ?? 'ping.archlinux.org';

/**
 * @optional
 */
export const LANGUAGE = process.env.LANGUAGE ?? 'en';

/**
 * @optional
 */
export const MAX_AUDIO_FILE_SIZE =
	parseInt(process.env.MAX_AUDIO_FILE_SIZE!) || 1024 * 1024 * 1024 * 100; // Default is 100MB

/**
 * @optional
 */
export const PLACEHOLDER_IMG =
	process.env.PLACEHOLDER_IMG ??
	'https://raw.githubusercontent.com/Guusvanmeerveld/Tempo/master/img/placeholder.jpg';

/**
 * @optional
 */
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

/**
 * @optional
 */
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

/**
 * @optional
 */
export const MAX_QUEUE_LENGTH = parseInt(process.env.MAX_QUEUE_LENGTH!) || 50;
