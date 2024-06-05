// framework
import { Event, } from '../../framework/Event.js'

// framework types
import type { IEvent } from '../../framework/Event.js'

//#region interface
interface IReservationConfirmed extends IEvent {
}
export type { IReservationConfirmed }
//#endregion interface

export class ReservationConfirmed extends Event implements IReservationConfirmed {
}
