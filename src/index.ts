import preStartChecks from './checks';

import { BOT_TOKEN } from '@global/config';

import client from '@src/client';
import '@src/events';

console.clear();

preStartChecks().then(() => client.login(BOT_TOKEN));
