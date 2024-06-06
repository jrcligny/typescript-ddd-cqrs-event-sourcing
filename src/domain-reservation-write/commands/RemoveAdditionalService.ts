// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface IRemoveAdditionalService extends ICommand {
	/**
	 * The id of the service to remove
	 */
	readonly serviceId: string
}
export type { IRemoveAdditionalService }
//#endregion interface

export class RemoveAdditionalService extends Command implements IRemoveAdditionalService {
	constructor (
		reservationId: string,
		public readonly serviceId: string,
		expectedReservationVersion: number
	) {
		super(RemoveAdditionalService.name, reservationId, expectedReservationVersion)
	}
}
