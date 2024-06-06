// core types
import type { IRepository } from '../core/Repository.js'

// domain types
import type { Reservation } from './Reservation.js'

//#region interface
interface IReservationRepository extends IRepository<Reservation> {
}
export type { IReservationRepository }
//#endregion interface