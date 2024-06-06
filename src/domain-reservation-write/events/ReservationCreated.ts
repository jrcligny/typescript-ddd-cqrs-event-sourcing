// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IReservationCreated extends IEvent {
	/**
	 * The id of the house that was reserved
	 */
	readonly houseId: string
	/**
	 * The date the guests will arrive
	 */
	readonly arrivalDate: Date
	/**
	 * The date the guests will depart
	 */
	readonly departureDate: Date
	/**
	 * The price of the reservation
	 */
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
		super(ReservationCreated.name, reservationId)
	}
}
