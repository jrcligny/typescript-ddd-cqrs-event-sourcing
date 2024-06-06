import type { IMessage, } from '../../core/message-bus/Message.js'

//#region interface
interface IGetAllReservations extends IMessage {
	/**
	 * The house id to filter the reservations by.
	 */
	readonly houseId?: string
	/**
	 * The arrival date from which to filter the reservations by.
	 */
	readonly arrivalDateFrom?: Date
	/**
	 * The arrival date up to which to filter the reservations by.
	 */
	readonly arrivalDateTo?: Date
}
export type { IGetAllReservations }
//#endregion interface

export class GetAllReservations implements IGetAllReservations {

	public readonly name = GetAllReservations.name

	constructor(
		public readonly houseId?: string,
		public readonly arrivalDateFrom?: Date,
		public readonly arrivalDateTo?: Date
	) {}
}
