import type { IAggregateFactory, } from './AggregateFactory.js'
import type { AggregateRoot, } from './AggregateRoot.js'
import type { IEventStore, } from './event-store/EventStore.js'

/**
 * Represents a repository for storing and retrieving aggregate roots.
 *
 * @typeparam T - The type of the aggregate root.
 */
interface IRepository<T extends AggregateRoot> {
	/**
	 * Saves the changes made to an aggregate root.
	 *
	 * @param aggregate - The aggregate root to be saved.
	 * @param expectedVersion - The expected version of the aggregate root to ensure optimistic concurrency.
	 */
	save(aggregate: T, expectedVersion: number): Promise<void>

	/**
	 * Retrieves an aggregate root by its unique identifier.
	 *
	 * @param id - The unique identifier of the aggregate root.
	 * @returns The retrieved aggregate root.
	 */
	getById(id: string): Promise<T>
}
export type { IRepository }

/**
 * Represents a repository for storing and retrieving aggregate roots.
 * It provides methods to save and retrieve aggregate roots using an event store and a factory.
 *
 * @typeparam T - The type of the aggregate root.
 */
export class Repository<T extends AggregateRoot> implements IRepository<T> {
	/**
	 * Creates a new instance of the `Repository` class.
	 *
	 * @param storage - The event store used to persist and retrieve events.
	 * @param factory - The factory used to create instances of the aggregate root.
	 */
	constructor(
		private readonly storage: IEventStore,
		private readonly factory: IAggregateFactory<T>,
	) { }

	public async save(aggregate: T, expectedVersion: number): Promise<void> {
		await this.storage.saveEvents(aggregate.getId(), aggregate.getUncommittedChanges(), expectedVersion)
		aggregate.markChangesAsCommitted()
	}

	public async getById(id: string): Promise<T> {
		const history = await this.storage.getEventsForAggregate(id)
		return this.factory.loadFromHistory(history)
	}
}