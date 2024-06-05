//#region interface
interface IHouseUnavailabilityRecord {
	id: string;
	houseId: string;
	arrivalDate: Date;
	departureDate: Date;
	reason: string;
}
export type { IHouseUnavailabilityRecord }
//#endregion interface

export class HouseUnavailabilityRecord implements IHouseUnavailabilityRecord {
	constructor(
		public id: string,
		public houseId: string,
		public arrivalDate: Date,
		public departureDate: Date,
		public reason: string,
	) { }
}
