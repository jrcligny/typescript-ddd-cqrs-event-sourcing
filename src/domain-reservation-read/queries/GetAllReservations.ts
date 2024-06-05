//#region interface
interface IGetAllReservations {
	readonly houseId?: string
	readonly arrivalDateFrom?: Date
	readonly arrivalDateTo?: Date
}
export type { IGetAllReservations }
//#endregion interface

export class GetAllReservations implements IGetAllReservations {
	constructor(
		public readonly houseId?: string,
		public readonly arrivalDateFrom?: Date,
		public readonly arrivalDateTo?: Date
	) {}
}
