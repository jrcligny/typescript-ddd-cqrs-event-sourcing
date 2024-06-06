// node
import fs from 'fs'
import path from 'path'
import readline from 'readline';
// core
import { EventDescriptor } from './EventDescriptor.js'
import { IEventStore } from './EventStore.js'

// core types
import type { IEvent, } from '../message-bus/Event.js'
import type { IEventBus, } from '../message-bus/EventBus.js'
import type { IEventDescriptor } from './EventDescriptor.js'

/**
 * Represents an event store that stores and retrieves events for aggregates.
 * 
 * It stores events in JSON file and publishes them to the message bus.
 */
export class JSONFileEventStore implements IEventStore {

	/**
	 * Creates a new instance of the JSONFileEventStore class.
	 * @param messageBus The message bus used to publish events.
	 */
	constructor(
		private readonly messageBus: IEventBus,
		private readonly rootDir: string
	) { }

	/**
	 * Retrieves all events for the specified aggregate.
	 * @param aggregateId The ID of the aggregate.
	 * @returns An array of events for the specified aggregate.
	 * @throws Error if the aggregate is not found.
	 */
	public async getEventsForAggregate(aggregateId: string): Promise<IEvent[]> {

		const filePath = path.join(this.rootDir, `${aggregateId}.json`)
		const events: IEvent[] = [];

		try {
			const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' })
			const rl = readline.createInterface({
				input: fileStream,
				crlfDelay: Infinity
			})
		
			for await (const line of rl) {
				const eventDescriptor: IEventDescriptor = JSON.parse(line);
				events.push(eventDescriptor.event);
			}

		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new Error('Aggregate corrupted. Invalid event format.')
			} else if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
				throw new Error('Aggregate not found.')
			} else {
				throw new Error('Aggregate cannot be read.')
			}
		}

		return events
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

		const lastEventDescriptor = await this.getLastEventDescriptor(aggregateId)
		if (lastEventDescriptor && lastEventDescriptor.version !== expectedAggregateVersion) {
			throw new Error(
				'An operation has been performed on an aggregate root that is out of date.'
			)
		}

		let i = expectedAggregateVersion
		for await (const event of newEvents) {
			i += 1
			fs.promises.appendFile(
				path.join(this.rootDir, `${aggregateId}.json`),
				JSON.stringify(new EventDescriptor(aggregateId, event, i)) + '\n',
				{ encoding: 'utf8', flag: 'a' }
			)
		}

		this.publish(newEvents)
	}

	/**
	 * @private
	 * Retrieves the last event descriptor for the specified aggregate.
	 *
	 * @param aggregateId The ID of the aggregate.
	 * @returns The last event descriptor for the specified aggregate.
	 */
	private async getLastEventDescriptor(aggregateId: string): Promise<IEventDescriptor | null> {

		const filePath = path.join(this.rootDir, `${aggregateId}.json`)

		let lastEventDescriptor: IEventDescriptor | null = null

		try {
			const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
		
			const rl = readline.createInterface({
				input: fileStream,
				crlfDelay: Infinity
			});
		
			let lastLine = '';
			for await (const line of rl) {
				lastLine = line;
			}
		
			lastEventDescriptor = JSON.parse(lastLine);

		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new Error('Aggregate corrupted. Invalid event format.')
			} else if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
				// Aggregate not found - no events have been saved yet.
			} else {
				throw new Error('Aggregate cannot be read.')
			}
		}

		return lastEventDescriptor
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