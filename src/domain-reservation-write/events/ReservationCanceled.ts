// framework
import { Event, } from '../../framework/Event.js'

// framework types
import type { IEvent } from '../../framework/Event.js'

//#region interface
interface IReservationCanceled extends IEvent {
}
export type { IReservationCanceled }
//#endregion interface

export class ReservationCanceled extends Event implements IReservationCanceled {
}
