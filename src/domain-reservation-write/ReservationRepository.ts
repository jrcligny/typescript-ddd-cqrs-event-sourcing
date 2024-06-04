// framework types
import type { IRepository } from '../framework/Repository.js'

// domain types
import type { Reservation } from './Reservation.js'

//#region interface
interface IReservationRepository extends IRepository<Reservation> {
}
export type { IReservationRepository }
//#endregion interface