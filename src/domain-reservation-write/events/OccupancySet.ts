import { Event, } from '../../framework/Event.js'

export class OccupancySet extends Event {

	constructor (
		reservationId: string,
		public readonly numberOfGuests: number
	) {
		super(reservationId)
	}
}