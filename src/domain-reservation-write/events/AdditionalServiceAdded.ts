import { Event, } from '../../framework/Event.js'

export class AdditionalServiceAdded extends Event {

	constructor (
		reservationId: string,
		public readonly serviceId: string,
		public readonly name: string,
		public readonly price: number
	) {
		super(reservationId)
	}
}