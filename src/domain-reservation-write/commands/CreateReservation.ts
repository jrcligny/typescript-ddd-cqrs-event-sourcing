// framework
import { Command, } from '../../framework/Command.js'

// framework types
import type { ICommand, } from '../../framework/Command.js'

//#region interface
interface ICreateReservation extends ICommand {
	readonly roomId: string
	readonly startDate: Date
	readonly endDate: Date
	readonly price: number
}
export type { ICreateReservation }
//#endregion interface

export class CreateReservation extends Command implements ICreateReservation {
	constructor (
		reservationId: string,
		public readonly roomId: string,
		public readonly startDate: Date,
		public readonly endDate: Date,
		public readonly price: number
	) {
		super(reservationId, -1)
	}
}
