export default class BotError {
	constructor(public message: string, public type?: ErrorType) {}
}

export enum ErrorType {
	NotFound = 404,
	VoiceNotConnected = 601,
}
