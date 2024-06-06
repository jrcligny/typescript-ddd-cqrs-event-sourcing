// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface IAddAdditionalService extends ICommand {
	/**
	 * The id of the service to add
	 */
	readonly serviceId: string
	/**
	 * The name of the service to add
	 */
	readonly name: string
	/**
	 * The price of the service to add
	 */
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
		super(AddAdditionalService.name, reservationId, expectedReservationVersion)
	}
}
