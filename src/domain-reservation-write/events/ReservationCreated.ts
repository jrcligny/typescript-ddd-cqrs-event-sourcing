import { Event, } from '../../framework/Event.js'

export class ReservationCreated extends Event {

	constructor (
		reservationId: string,
		public readonly houseId: string,
		public readonly startDate: Date,
		public readonly endDate: Date,
		public readonly price: number
	) {
		super(reservationId)
	}
}
