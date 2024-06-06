// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface ISetSpecialRequest extends ICommand {
	/**
	 * The special request for the reservation
	 */
	readonly specialRequest: string
}
export type { ISetSpecialRequest }
//#endregion interface

export class SetSpecialRequest extends Command implements ISetSpecialRequest {
	constructor (
		reservationId: string,
		public readonly specialRequest: string,
		expectedReservationVersion: number
	) {
		super(SetSpecialRequest.name, reservationId, expectedReservationVersion)
	}
}
