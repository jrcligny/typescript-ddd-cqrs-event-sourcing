// framework
import { Command, } from '../../framework/Command.js'

// framework types
import type { ICommand, } from '../../framework/Command.js'

//#region interface
interface ICreateReservation extends ICommand {
	readonly houseId: string
	readonly arrivalDate: Date
	readonly departureDate: Date
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
		super(reservationId, -1)
	}
}
