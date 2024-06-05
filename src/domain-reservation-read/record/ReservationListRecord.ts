interface IReservationListRecord {
	reservationId: string
	houseId: string
	guestId: string | undefined
	arrivalDate: Date
	departureDate: Date
	price: number
	numberOfGuests: number
	hasSpecialRequest: boolean
	numberOfAdditionalServices: number
	status: 'Created' | 'Confirmed' | 'Canceled'
}
export type { IReservationListRecord }

export class ReservationListRecord implements IReservationListRecord {
	constructor(
		public reservationId: string,
		public houseId: string,
		public guestId: string | undefined,
		public arrivalDate: Date,
		public departureDate: Date,
		public price: number,
		public numberOfGuests: number,
		public hasSpecialRequest: boolean,
		public numberOfAdditionalServices: number,
		public status: 'Created' | 'Confirmed' | 'Canceled',
	) {}
}
