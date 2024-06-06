// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IAdditionalServiceRemoved extends IEvent {
	readonly serviceId: string
}
export type { IAdditionalServiceRemoved }
//#endregion interface

export class AdditionalServiceRemoved extends Event implements IAdditionalServiceRemoved {
	constructor (
		reservationId: string,
		public readonly serviceId: string
	) {
		super(reservationId)
	}
}