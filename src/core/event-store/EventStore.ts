import type { IEvent, } from '../message-bus/Event.js'

//#region interface
/**
 * Represents an event store that stores and retrieves events for aggregates.
 */
interface IEventStore {

	/**
	 * Retrieves all events for the specified aggregate.
	 * @param aggregateId The ID of the aggregate.
	 * @returns An array of events for the specified aggregate.
	 */
	getEventsForAggregate(aggregateId: string): Promise<IEvent[]>

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
	): Promise<void>
}
export type { IEventStore }
//#endregion interface
