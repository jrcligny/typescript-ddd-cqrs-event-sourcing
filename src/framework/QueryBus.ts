import type { IMessage, } from './Message.js'

/**
 * Represents a message bus that handles queries.
 * 
 * Responsible for routing messages to their corresponding handlers.
 * It allows registering query handlers for specific query names.
 * It also provides a method to send queries.
 */
interface IQueryBus {

	/**
	 * Registers query handlers for multiple query names.
	 * @param queryNames The names of the queries to register the handler for.
	 * @param queryHandler The query handler object.
	 */
	registerHandlers(
		queryNames: string[],
		handlers: any
	): void

	/**
	 * Sends a query to its corresponding query handler.
	 * @param query The query to send.
	 */
	send<T extends IMessage, U>(query: T): Promise<U>
}
export type { IQueryBus, }

/**
 * Represents a message bus that handles events and queries.
 */
export class QueryBus implements IQueryBus {

	/**
	 * @private
	 * Stores query handlers for each query name.
	 */
	private readonly handlersFor: { [key:string]: any } = {}

	/**
	 * Registers query handlers for multiple query names.
	 * @param queryNames The names of the queries to register the handler for.
	 * @param queryHandler The query handler object. It must have a method for each query name matching the pattern handle{QueryName}.
	 * @throws Error if the handler does not have a method for the query.
	 * 
	 * @example
	 * ```typescript
	 * messageBus.registerHandlers(
	 * 	[
	 * 		'CreateOrder',
	 * 		'UpdateOrder'
	 * 	],
	 * 	{
	 * 		handleCreateOrder: (query: CreateOrder) => { ... },
	 * 		handleUpdateOrder: (query: UpdateOrder) => { ... }
	 * 	}
	 * )
	 * ```
	 */
	public registerHandlers(
		queryNames: string[],
		queryHandler: any
	): void {
		queryNames.forEach((queryName) => {
			if (!queryHandler[`handle${queryName}`])
			{
				throw new Error(
					`Could not find handle${queryName} in ${queryHandler.constructor.name}.`
				)
			}
			this.handlersFor[queryName] = queryHandler[`handle${queryName}`]
		})
	}

	/**
	 * Sends a query to its corresponding query handler.
	 * @param query The query to send.
	 * @throws Error if no handler is registered for the query.
	 */
	public async send<T extends IMessage, U>(query: T): Promise<U> {
		const queryName = query.constructor.name
		if (!this.handlersFor[queryName])
		{
			throw new Error(`No handler registered for ${queryName}`)
		}

		return this.handlersFor[queryName](query)
	}
}