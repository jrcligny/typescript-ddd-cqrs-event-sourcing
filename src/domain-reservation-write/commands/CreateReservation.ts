import { Command, } from '../../framework/Command.js'

export class CreateReservation extends Command {

	constructor (
		reservationId: string,
		public readonly roomId: string,
		public readonly startDate: Date,
		public readonly endDate: Date,
		public readonly price: number
	) {
		super(reservationId, -1)
	}
}
