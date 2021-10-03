import Command from '@models/command';

import { help } from './help';
// import { play } from './play';

const Commands = new Map<string, Command>();

Commands.set('help', help);
// Commands.set('play', play);

export default Commands;
