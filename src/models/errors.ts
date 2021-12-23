export default class BotError {
	constructor(public message: string | ErrorType) {}
}

export enum ErrorType {
	NotFound = 'Could not find song',
	VoiceNotConnected = 'Not connected to any voice channel',
	NothingPlaying = 'There is nothing playing',
	Paused = 'Paused the current song',
	Resumed = 'Resumed the current song',
}
