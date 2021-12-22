import * as JSONCache from './json';
import * as RedisCache from './redis';
import { createHash } from 'crypto';

import { REDIS_URL } from '@src/config';

export const hash = (string: string): string => createHash('sha256').update(string).digest('hex');

const Cache = REDIS_URL ? RedisCache : JSONCache;

export default Cache;
