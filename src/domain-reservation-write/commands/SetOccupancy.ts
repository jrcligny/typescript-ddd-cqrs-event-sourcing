// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface ISetOccupancy extends ICommand {
	/**
	 * The number of guests that will occupy the room
	 */
	readonly numberOfGuests: number
}
export type { ISetOccupancy }
//#endregion interface

export class SetOccupancy extends Command implements ISetOccupancy {
	constructor (
		reservationId: string,
		public readonly numberOfGuests: number,
		expectedReservationVersion: number
	) {
		super(SetOccupancy.name, reservationId, expectedReservationVersion)
	}
}
