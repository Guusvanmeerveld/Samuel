import preStartChecks from './checks';

import client from '@src/client';
import { BOT_TOKEN } from '@src/config';
import '@src/events';

console.clear();

preStartChecks().then(() => client.login(BOT_TOKEN));
