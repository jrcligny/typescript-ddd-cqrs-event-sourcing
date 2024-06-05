// framework
import { Event, } from '../../framework/Event.js'

// framework types
import type { IEvent } from '../../framework/Event.js'

//#region interface
interface IReservationCreated extends IEvent {
	readonly houseId: string
	readonly arrivalDate: Date
	readonly departureDate: Date
	readonly price: number
}
export type { IReservationCreated }
//#endregion interface

export class ReservationCreated extends Event implements IReservationCreated {
	constructor (
		reservationId: string,
		public readonly houseId: string,
		public readonly arrivalDate: Date,
		public readonly departureDate: Date,
		public readonly price: number
	) {
		super(reservationId)
	}
}
