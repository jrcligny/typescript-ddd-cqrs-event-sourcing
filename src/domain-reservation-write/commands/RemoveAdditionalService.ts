// framework
import { Command, } from '../../framework/Command.js'

// framework types
import type { ICommand, } from '../../framework/Command.js'

//#region interface
interface IRemoveAdditionalService extends ICommand {
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
		super(reservationId, expectedReservationVersion)
	}
}
