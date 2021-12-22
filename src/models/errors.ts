export default class BotError {
	constructor(public message: string | ErrorType) {}
}

export enum ErrorType {
	NotFound = 404,
	VoiceNotConnected = 601,
}
