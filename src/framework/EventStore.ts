import type { IEvent, } from './Event.js'
import type { IEventBus, } from './EventBus.js'

/**
 * Represents an event store that stores and retrieves events for aggregates.
 */
interface IEventStore {

	/**
	 * Retrieves all events for the specified aggregate.
	 * @param aggregateId The ID of the aggregate.
	 * @returns An array of events for the specified aggregate.
	 */
	getEventsForAggregate(aggregateId: string): IEvent[]

	/**
	 * Saves new events for the specified aggregate.
	 *
	 * @param aggregateId The ID of the aggregate.
	 * @param newEvents The new events to be saved.
	 * @param expectedAggregateVersion The expected version of the aggregate.
	 */
	saveEvents(
		aggregateId: string,
		events: IEvent[],
		expectedVersion: number
	): void
}
export type { IEventStore, }

/**
 * Represents a descriptor for an event.
 * It contains the aggregate identifier, the event, and the version of the aggregate.
 */
class EventDescriptor {
	constructor(
		/** The identifier of the aggregate. */
		public readonly aggregateId: string,
		/** The event. */
		public readonly event: IEvent,
		/** The version of the aggregate. */
		public readonly version: number
	) { }
}

/**
 * Represents an event store that stores and retrieves events for aggregates.
 * 
 * It stores events in memory and publishes them to the message bus.
 */
export class EventStore implements IEventStore {

	/**
	 * The events stored grouped by aggregate ID.
	 */
	private readonly events: { [key: string]: EventDescriptor[] } = {}

	/**
	 * Creates a new instance of the EventStore class.
	 * @param messageBus The message bus used to publish events.
	 */
	constructor(
		private readonly messageBus: IEventBus
	) { }

	/**
	 * Retrieves all events for the specified aggregate.
	 * @param aggregateId The ID of the aggregate.
	 * @returns An array of events for the specified aggregate.
	 * @throws Error if the aggregate is not found.
	 */
	public getEventsForAggregate(aggregateId: string): IEvent[] {
		if (!this.events[aggregateId])
		{
			throw Error('Aggregate not found.')
		}

		return this.events[aggregateId].map(
			(eventDescriptor) => eventDescriptor.event
		)
	}

	/**
	 * Saves new events for the specified aggregate.
	 *
	 * Check if the last event registered for the aggregate has the expected version: if not, throw an error.
	 * Publish the new events to the message bus.
	 *
	 * @param aggregateId The ID of the aggregate.
	 * @param newEvents The new events to be saved.
	 * @param expectedAggregateVersion The expected version of the aggregate.
	 * @throws Error if the aggregate is out of date.
	 */
	public saveEvents(
		aggregateId: string,
		newEvents: IEvent[],
		expectedAggregateVersion: number
	): void {
		if (!this.events[aggregateId]) {
			this.events[aggregateId] = []
		}

		const lastEventDescriptor = this.getLastEventDescriptor(aggregateId)
		if (
			this.events[aggregateId].length > 0 &&
			lastEventDescriptor.version !== expectedAggregateVersion
		) {
			throw Error(
				'An operation has been performed on an aggregate root that is out of date.'
			)
		}
		let i = 0
		newEvents.forEach((event: IEvent) => {
			i += 1
			this.events[aggregateId].push(new EventDescriptor(aggregateId, event, i))
		})

		this.publish(newEvents)
	}

	/**
	 * @private
	 * Retrieves the last event descriptor for the specified aggregate.
	 *
	 * @param aggregateId The ID of the aggregate.
	 * @returns The last event descriptor for the specified aggregate.
	 */
	private getLastEventDescriptor(aggregateId: string): EventDescriptor {
		return this.events[aggregateId][this.events[aggregateId].length - 1]
	}

	/**
	 * @private
	 * Publish the specified events to the message bus.
	 *
	 * @param events The events to be published.
	 */
	private publish(events: IEvent[]): void {
		events.forEach((event: IEvent) => this.messageBus.publish(event))
	}
}