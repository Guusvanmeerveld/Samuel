import Command from '@models/command';

import { help } from './help';
import { play } from './play';
import { disconnect } from './disconnect';
import { join } from './join';

const Commands = new Map<string, Command>();

Commands.set('help', help);
Commands.set('play', play);
Commands.set('disconnect', disconnect);
Commands.set('join', join);

export default Commands;
