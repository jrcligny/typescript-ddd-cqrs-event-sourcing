// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface ICreateReservation extends ICommand {
	/**
	 * The house id
	 */
	readonly houseId: string
	/**
	 * The arrival date
	 */
	readonly arrivalDate: Date
	/**
	 * The departure date
	 */
	readonly departureDate: Date
	/**
	 * The price of the stay
	 */
	readonly price: number
}
export type { ICreateReservation }
//#endregion interface

export class CreateReservation extends Command implements ICreateReservation {
	constructor (
		reservationId: string,
		public readonly houseId: string,
		public readonly arrivalDate: Date,
		public readonly departureDate: Date,
		public readonly price: number
	) {
		super(CreateReservation.name, reservationId, -1)
	}
}
