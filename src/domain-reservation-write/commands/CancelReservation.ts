// framework
import { Command, } from '../../framework/Command.js'

// framework types
import type { ICommand, } from '../../framework/Command.js'

//#region interface
interface ICancelReservation extends ICommand {
}
export type { ICancelReservation }
//#endregion interface

export class CancelReservation extends Command implements ICancelReservation {
}