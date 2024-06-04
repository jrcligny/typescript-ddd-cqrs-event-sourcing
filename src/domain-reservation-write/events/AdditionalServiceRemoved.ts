// framework
import { Event, } from '../../framework/Event.js'

// framework types
import type { IEvent } from '../../framework/Event.js'

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