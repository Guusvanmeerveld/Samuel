import { REDIS_URL } from '@src/config';

import * as RedisCache from './redis';
import * as JSONCache from './json';

const Cache = REDIS_URL ? RedisCache : JSONCache;

export default Cache;
