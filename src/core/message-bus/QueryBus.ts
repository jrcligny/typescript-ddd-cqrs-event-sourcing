import type { IMessage, } from './Message.js'

//#region interface
/**
 * Represents a message bus that handles queries.
 * 
 * Responsible for routing messages to their corresponding handlers.
 * It allows registering query handlers for specific query names.
 * It also provides a method to send queries.
 */
interface IQueryBus {
	/**
	 * Registers a query handler for a specific query name.
	 * @param queryName The name of the query to register the handler for.
	 * @param handler The query handler function.
	 * @param thisArg The instance to bind the handler to.
	 */
	registerHandler(
		queryName: string,
		handler: any,
		thisArg: any
	): void

	/**
	 * Sends a query to its corresponding query handler.
	 * @param query The query to send.
	 */
	send<T extends IMessage, U>(query: T): Promise<U>
}
export type { IQueryBus }
//#endregion interface

/**
 * Represents a message bus that handles events and queries.
 */
export class QueryBus implements IQueryBus {

	/**
	 * @private
	 * Stores query handlers for each query name.
	 */
	private readonly handlersFor: { [key:string]: any } = {}

	public registerHandler(queryName: string, handler: any, thisArg: any): void {
		this.handlersFor[queryName] = handler.bind(thisArg)
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