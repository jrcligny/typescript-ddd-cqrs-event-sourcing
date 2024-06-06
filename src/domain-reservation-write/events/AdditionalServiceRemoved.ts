// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IAdditionalServiceRemoved extends IEvent {
	/**
	 * The id of the service that was removed
	 */
	readonly serviceId: string
}
export type { IAdditionalServiceRemoved }
//#endregion interface

export class AdditionalServiceRemoved extends Event implements IAdditionalServiceRemoved {
	constructor (
		reservationId: string,
		public readonly serviceId: string
	) {
		super(AdditionalServiceRemoved.name, reservationId)
	}
}