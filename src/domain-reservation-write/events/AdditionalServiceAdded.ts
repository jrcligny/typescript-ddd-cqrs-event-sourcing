// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IAdditionalServiceAdded extends IEvent {
	/**
	 * The id of the service added
	 */
	readonly serviceId: string
	/**
	 * The description of the service added
	 */
	readonly description: string
	/**
	 * The price of the service added
	 */
	readonly price: number
}
export type { IAdditionalServiceAdded }
//#endregion interface

export class AdditionalServiceAdded extends Event implements IAdditionalServiceAdded {
	constructor (
		reservationId: string,
		public readonly serviceId: string,
		public readonly description: string,
		public readonly price: number
	) {
		super(AdditionalServiceAdded.name, reservationId)
	}
}