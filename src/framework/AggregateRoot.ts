import type { IEvent, } from './Event.js'

/**
 * Represents an aggregate root.
 * 
 * In Event Sourcing, the state of an aggregate is derived by applying a series of events to it.
 * It provides a base implementation for aggregate roots, including methods for managing
 * changes, versioning, and loading from history.
 */
export abstract class AggregateRoot {

	/**
	 * @protected
	 * The unique identifier of the aggregate.
	 */
	protected id!: string

	/**
	 * @private
	 * Array to store the uncommitted changes made to the aggregate.
	 */
	private readonly changes: IEvent[] = []

	/**
	 * @private
	 * The version number of the aggregate.
	 */
	private version: number = 0

	/**
	 * Gets the identifier of the aggregate.
	 * @returns The identifier of the aggregate.
	 */
	public getId(): string {
		return this.id
	}

	/**
	 * Gets the version number of the aggregate.
	 * @returns The version number of the aggregate.
	 */
	public getVersion(): number {
		return this.version
	}

	/**
	 * Gets the uncommitted changes made to the aggregate.
	 * @returns An array of uncommitted changes.
	 */
	public getUncommittedChanges(): IEvent[] {
		return this.changes
	}

	/**
	 * Marks the changes as committed.
	 */
	public markChangesAsCommitted(): void {
		this.changes.length = 0
	}

	/**
	 * Loads the aggregate from its history.
	 * @param history - An array of events representing the aggregate's history.
	 */
	public loadFromHistory(history: IEvent[]): void {
		history.forEach((event) => {
			this.applyChangeInternal(event, false)
		})
	}

	/**
	 * Applies a change to the aggregate.
	 * @param event - The event representing the change to be applied.
	 */
	protected applyChange(event: IEvent): void {
		this.applyChangeInternal(event, true)
	}

	/**
	 * @private
	 * Applies a change to the aggregate internally.
	 * 
	 * If the change is new, it will be added to the list of uncommitted changes.
	 * Increments the version number of the aggregate.
	 *
	 * @param event - The event representing the change to be applied.
	 * @param isNew - Indicates whether the change is new or not.
	 */
	private applyChangeInternal(event: IEvent, isNew = false): void {
		if (!(this as any)[`apply${event.constructor.name}`]) {
			throw new Error(
				`No handler found for ${event.constructor.name}. Be sure to define a method called apply${event.constructor.name} on the aggregate.`
			)
		}

		(this as any)[`apply${event.constructor.name}`](event)
		this.version += 1

		if (isNew) {
			this.changes.push(event)
		}
	}
}