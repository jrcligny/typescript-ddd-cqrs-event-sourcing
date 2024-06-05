// framework
import { Command, } from '../../framework/Command.js'

// framework types
import type { ICommand, } from '../../framework/Command.js'

//#region interface
interface IConfirmReservation extends ICommand {
}
export type { IConfirmReservation }
//#endregion interface

export class ConfirmReservation extends Command implements IConfirmReservation {
}