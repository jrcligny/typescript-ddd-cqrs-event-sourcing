import { Event, } from '../../framework/Event.js'

export class SpecialRequestSet extends Event {

	constructor (
		reservationId: string,
		public readonly message: string
	) {
		super(reservationId)
	}
}