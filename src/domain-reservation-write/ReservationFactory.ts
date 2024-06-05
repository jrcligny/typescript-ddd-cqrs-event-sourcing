// domain
import { Reservation, } from './Reservation.js'

// framework types
import type { IEvent, } from '../framework/Event.js'
import type { IAggregateFactory, } from '../framework/AggregateFactory.js'

//#region interface
interface IReservationFactory extends IAggregateFactory<Reservation> {
}
export type { IReservationFactory }
//#endregion interface

export class ReservationFactory implements IReservationFactory {

	public create(
		id: string,
		houseId: string,
		arrivalDate: Date,
		departureDate: Date,
		price: number
	): Reservation {
		const reservation = new Reservation()
		reservation.create(id, houseId, arrivalDate, departureDate, price)
		return reservation
	}

	public loadFromHistory(history: IEvent[]): Reservation {
		const reservation = new Reservation()
		reservation.loadFromHistory(history)
		return reservation
	}
}