import { Event, } from '../../framework/Event.js'

export class AdditionalServiceRemoved extends Event {

	constructor (
		reservationId: string,
		public readonly serviceId: string
	) {
		super(reservationId)
	}
}