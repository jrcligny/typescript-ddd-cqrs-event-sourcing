// core
import { Event, } from '../../core/message-bus/Event.js'

// core types
import type { IEvent } from '../../core/message-bus/Event.js'

//#region interface
interface IReservationConfirmed extends IEvent {
}
export type { IReservationConfirmed }
//#endregion interface

export class ReservationConfirmed extends Event implements IReservationConfirmed {
}
