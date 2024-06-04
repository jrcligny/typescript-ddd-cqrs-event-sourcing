// framework
import { Command, } from '../../framework/Command.js'

// framework types
import type { ICommand, } from '../../framework/Command.js'

//#region interface
interface ISetOccupancy extends ICommand {
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
		super(reservationId, expectedReservationVersion)
	}
}
