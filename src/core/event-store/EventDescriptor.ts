import { IEvent, } from '../message-bus/Event.js'

//#region interface
interface IEventDescriptor {
	/** The identifier of the aggregate. */
	aggregateId: string
	/** The event. */
	event: IEvent
	/** The version of the aggregate. */
	version: number
}
export type { IEventDescriptor }
//#endregion interface

/**
 * Represents a descriptor for an event.
 * It contains the aggregate identifier, the event, and the version of the aggregate.
 */
export class EventDescriptor implements IEventDescriptor {
	constructor(
		public readonly aggregateId: string,
		public readonly event: IEvent,
		public readonly version: number
	) { }
}