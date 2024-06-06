// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IAdditionalServiceAdded extends IEvent {
	readonly serviceId: string
	readonly name: string
	readonly price: number
}
export type { IAdditionalServiceAdded }
//#endregion interface

export class AdditionalServiceAdded extends Event implements IAdditionalServiceAdded {

	constructor (
		reservationId: string,
		public readonly serviceId: string,
		public readonly name: string,
		public readonly price: number
	) {
		super(reservationId)
	}
}