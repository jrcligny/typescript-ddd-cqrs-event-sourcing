// core
import { Command, } from '../../core/message-bus/Command.js'

// core types
import type { ICommand, } from '../../core/message-bus/Command.js'

//#region interface
interface ICancelReservation extends ICommand {
}
export type { ICancelReservation }
//#endregion interface

export class CancelReservation extends Command implements ICancelReservation {
}