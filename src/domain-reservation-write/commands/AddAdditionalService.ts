// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface IAddAdditionalService extends ICommand {
	readonly serviceId: string
	readonly name: string
	readonly price: number
}
export type { IAddAdditionalService }
//#endregion interface

export class AddAdditionalService extends Command implements IAddAdditionalService {
	constructor (
		reservationId: string,
		public readonly serviceId: string,
		public readonly name: string,
		public readonly price: number,
		expectedReservationVersion: number
	) {
		super(reservationId, expectedReservationVersion)
	}
}
