console.clear();

import { BOT_TOKEN } from '@src/config';

import preStartChecks from './checks';

import '@src/events';

import client from '@src/client';

preStartChecks().then(() => client.login(BOT_TOKEN));
