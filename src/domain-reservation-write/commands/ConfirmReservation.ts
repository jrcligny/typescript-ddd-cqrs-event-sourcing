// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface IConfirmReservation extends ICommand {
}
export type { IConfirmReservation }
//#endregion interface

export class ConfirmReservation extends Command implements IConfirmReservation {
	constructor (
		reservationId: string,
		expectedAggregateVersion: number
	) {
		super(ConfirmReservation.name, reservationId, expectedAggregateVersion)
	}
}