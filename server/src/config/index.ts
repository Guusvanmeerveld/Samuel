import { config } from 'dotenv';

config();

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
