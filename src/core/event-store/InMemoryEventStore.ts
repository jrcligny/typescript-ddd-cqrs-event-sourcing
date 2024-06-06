import { EventDescriptor } from './EventDescriptor.js'
import { IEventStore } from './EventStore.js'

// core types
import type { IEvent, } from '../message-bus/Event.js'
import type { IEventBus, } from '../message-bus/EventBus.js'
import type { IEventDescriptor } from './EventDescriptor.js'

/**
 * Represents an event store that stores and retrieves events for aggregates.
 * 
 * It stores events in memory and publishes them to the message bus.
 */
export class InMemoryEventStore implements IEventStore {

	/**
	 * The events stored grouped by aggregate ID.
	 */
	private readonly events: { [key: string]: IEventDescriptor[] } = {}

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
	public async getEventsForAggregate(aggregateId: string): Promise<IEvent[]> {
		if (!this.events[aggregateId])
		{
			throw new Error('Aggregate not found.')
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
	public async saveEvents(
		aggregateId: string,
		newEvents: IEvent[],
		expectedAggregateVersion: number
	): Promise<void> {
		if (!this.events[aggregateId]) {
			this.events[aggregateId] = []
		}

		const lastEventDescriptor = this.getLastEventDescriptor(aggregateId)
		if (
			this.events[aggregateId].length > 0 &&
			lastEventDescriptor.version !== expectedAggregateVersion
		) {
			throw new Error(
				'An operation has been performed on an aggregate root that is out of date.'
			)
		}
		let i = expectedAggregateVersion
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