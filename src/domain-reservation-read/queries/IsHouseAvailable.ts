import type { IMessage, } from '../../core/message-bus/Message.js'

//#region interface
interface IIsHouseAvailable extends IMessage {
	/**
	 * The house id to check availability for.
	 */
	readonly houseId: string
	/**
	 * The arrival date to check availability for.
	 */
	readonly arrivalDate: Date
	/**
	 * The departure date to check availability for.
	 */
	readonly departureDate: Date
}
export type { IIsHouseAvailable }
//#endregion interface

export class IsHouseAvailable implements IIsHouseAvailable {

	public readonly name = IsHouseAvailable.name

	constructor(
		public readonly houseId: string,
		public readonly arrivalDate: Date,
		public readonly departureDate: Date
	) {}
}
