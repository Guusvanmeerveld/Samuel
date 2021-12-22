import { disconnect } from './disconnect';
import { help } from './help';
import { join } from './join';
import { ping } from './ping';
import { play } from './play';
import { stop } from './stop';

import Command from '@models/command';

const Commands = new Map<string, Command>();

Commands.set('help', help);
Commands.set('play', play);
Commands.set('disconnect', disconnect);
Commands.set('join', join);
Commands.set('stop', stop);
Commands.set('ping', ping);

export default Commands;
