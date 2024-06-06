import type { IMessage, } from './Message.js'

/**
 * Represents a command that can be sent to modify the state of an aggregate.
 *
 * A Command is named as an action in the imperative tense, such as CreateOrder, UpdateUser, or DeleteProduct.
 * It contains data about the action to be taken and is immutable once created.
 * 
 * In CQRS, commands are used to update the state of an aggregate in the write side.
 * 
 * A command is created when a user performs an action or a system action is triggered.
 * It is consumed by the Message Bus, which routes it to the appropriate Command Handler.
 * The Command Handler executes the command by loading the aggregate, applying the action,
 * and saving the changes using the Repository.
 * 
 * @example
 * ```typescript
 * class CreateOrder implements ICommand {
 * 	constructor(
 * 		public readonly aggregateId: string,
 * 		public readonly customerId: string,
 * 		public readonly orderDate: Date,
 * 		public readonly expectedAggregateVersion: number
 * 	) {}
 * }
 * ```
 */
interface ICommand extends IMessage {
	/**
	 * The unique identifier of the aggregate.
	 */
	readonly aggregateId: string

	/**
	 * The expected version of the aggregate when the command is executed.
	 * It is used for concurrency control in an event-sourced system.
	 */
	readonly expectedAggregateVersion: number
}
export type { ICommand }

/**
 * Represents a command that can be sent to modify the state of an aggregate.
 *
 * @example
 * ```typescript
 * class CreateOrder extends Command {
 * 	constructor(
 * 		orderId: string,
 * 		public readonly customerId: string,
 * 		public readonly orderDate: Date,
 * 		expectedAggregateVersion: number
 * 	) {
 * 		super('CreateOrder', orderId, expectedAggregateVersion)
 * 	}
 * }
 * ```
 */
export class Command implements ICommand {
	/**
	 * Creates a new instance of the Command class.
	 */
	constructor(
		public readonly name: string,
		public readonly aggregateId: string,
		public readonly expectedAggregateVersion: number
	) {}
}