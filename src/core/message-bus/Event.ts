import type { IMessage, } from './Message.js'

/**
 * Represents an event that occurred when an aggregate changes its state.
 * 
 * It is named in the past tense, such as OrderCreated, UserUpdated, or ProductDeleted.
 * An event contains data about the change and is immutable once created.
 * 
 * In Event Sourcing, events are stored in the Event Store and used to rebuild the state of an aggregate.
 * In CQRS, events are used to update the read models in the query side.
 *
 * An event is created by an Aggregate Root when a state change occurs.
 * It is then stored in the Event Store by the Repository on the Commit phase.
 * It is published to the Message Bus by the Event Store, which routes it to the appropriate Event Handlers.
 *
 * @example
 * ```typescript
 * class OrderCreated implements IEvent {
 * 	constructor(
 * 		public readonly aggregateId: string,
 * 		public readonly customerId: string,
 * 		public readonly orderDate: Date
 * 	) {}
 * }
 * ```
 */
interface IEvent extends IMessage {
	/**
	 * The identifier of the aggregate associated with the event.
	 */
	readonly aggregateId: string
}
export type { IEvent, }

/**
 * Represents an event that occurred when an aggregate changes its state.
 * 
 * @example
 * ```typescript
 * class OrderCreated extends Event {
 * 	constructor(
 * 		orderId: string,
 * 		public readonly customerId: string,
 * 		public readonly orderDate: Date
 * 	) {
 * 		super('OrderCreated', orderId)
 * 	}
 * }
 * ```
 */
export class Event implements IEvent {

	/**
	 * Creates a new instance of the Event class.
	 */
	constructor(
		public readonly name: string,
		public readonly aggregateId: string
	) {}
}