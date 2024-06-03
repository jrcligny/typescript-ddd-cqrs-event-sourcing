import { Command, } from '../../framework/Command.js'

export class SetOccupancy extends Command {

	constructor (
		reservationId: string,
		public readonly numberOfGuests: number,
		expectedReservationVersion: number
	) {
		super(reservationId, expectedReservationVersion)
	}
}
