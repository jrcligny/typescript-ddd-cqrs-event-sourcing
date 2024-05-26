import type { IEvent, } from './Event.js'
import type { IMessage, } from './Message.js'

/**
 * Represents a message bus that handles events.
 * 
 * Responsible for routing messages to their corresponding handlers.
 * It allows registering event handlers for specific event types.
 * It also provides a method to publish events.
 */
interface IEventBus {

	/**
	 * Registers an event handler for a specific event type.
	 * @param event The event type to register the handler for.
	 * @param handler The event handler function.
	 */
	registerHandler<T extends IEvent>(
		event: T,
		handler: (e: IMessage) => void
	): void

	/**
	 * Publishes an event to its corresponding event handlers.
	 * @param event The event to publish.
	 */
	publish<T extends IEvent>(event: T): void
}
export type { IEventBus }

/**
 * Represents a message bus that handles events.
 */
export class EventBus implements IEventBus {

	/**
	 * @private
	 * Stores event handlers for each event type.
	 */
	private readonly handlerFor: { [key:string]: ((e: IMessage) => void)[] } = {}

	public registerHandler<T extends IEvent>(
		event: T,
		handler: (e: IMessage) => void
	): void {
		const eventName = event.constructor.name
		if (!this.handlerFor[eventName])
		{
			this.handlerFor[eventName] = []
		}
		this.handlerFor[eventName].push(handler)
	}

	public publish<T extends IEvent>(event: T): void {
		const eventName = event.constructor.name
		if (this.handlerFor[eventName])
		{
			this.handlerFor[eventName].forEach((handler) => handler(event))
		}
	}
}