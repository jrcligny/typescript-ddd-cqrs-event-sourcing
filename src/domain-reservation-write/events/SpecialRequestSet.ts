// framework
import { Event, } from '../../framework/Event.js'

// framework types
import type { IEvent } from '../../framework/Event.js'

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