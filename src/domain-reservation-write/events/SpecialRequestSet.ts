// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface ISpecialRequestSet extends IEvent {
	readonly message: string
}
export type { ISpecialRequestSet }
//#endregion interface

export class SpecialRequestSet extends Event implements ISpecialRequestSet {
	constructor (
		reservationId: string,
		public readonly message: string
	) {
		super(reservationId)
	}
}