//#region interface
interface IIsHouseAvailable {
	readonly houseId: string
	readonly arrivalDate: Date
	readonly departureDate: Date
}
export type { IIsHouseAvailable }
//#endregion interface

export class IsHouseAvailable implements IIsHouseAvailable {
	constructor(
		public readonly houseId: string,
		public readonly arrivalDate: Date,
		public readonly departureDate: Date
	) {}
}
