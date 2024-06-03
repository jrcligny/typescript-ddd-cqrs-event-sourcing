import type { IRepository } from '../framework/Repository.js'
import type { Reservation } from './Reservation.js'

interface IReservationRepository extends IRepository<Reservation> {
}
export type { IReservationRepository, }