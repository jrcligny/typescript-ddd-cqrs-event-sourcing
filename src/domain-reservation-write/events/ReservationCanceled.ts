// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IReservationCanceled extends IEvent {
}
export type { IReservationCanceled }
//#endregion interface

export class ReservationCanceled extends Event implements IReservationCanceled {
	constructor (
		reservationId: string
	) {
		super(ReservationCanceled.name, reservationId)
	}
}
