import { Reservation, } from './Reservation.js'

import type { IEvent, } from '../framework/Event.js'
import type { IAggregateFactory, } from '../framework/AggregateFactory.js'

interface IReservationFactory extends IAggregateFactory<Reservation> {
}
export type { IReservationFactory, }

export class ReservationFactory implements IReservationFactory {

	public create(
		id: string,
		houseId: string,
		startDate: Date,
		endDate: Date,
		price: number
	): Reservation {
		const reservation = new Reservation()
		reservation.create(id, houseId, startDate, endDate, price)
		return reservation
	}

	public loadFromHistory(history: IEvent[]): Reservation {
		const reservation = new Reservation()
		reservation.loadFromHistory(history)
		return reservation
	}
}