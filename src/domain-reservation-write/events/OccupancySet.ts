// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IOccupancySet extends IEvent {
	readonly numberOfGuests: number
}
export type { IOccupancySet }
//#endregion interface

export class OccupancySet extends Event implements IOccupancySet {
	constructor (
		reservationId: string,
		public readonly numberOfGuests: number
	) {
		super(reservationId)
	}
}