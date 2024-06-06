import { Repository, } from './Repository.js'

import type { IAggregateFactory, } from './AggregateFactory.js'
import type { AggregateRoot, } from './AggregateRoot.js'
import type { IEvent, } from './message-bus/Event.js'
import type { IEventStore, } from './event-store/EventStore.js'

describe('Repository', () => {
	let repository: Repository<AggregateRoot>
	let storage: IEventStore
	let factory: IAggregateFactory<AggregateRoot>

	beforeEach(() => {
		storage = <IEventStore>{
			saveEvents: <any>jest.fn(),
			getEventsForAggregate: <any>jest.fn()
		}
		factory = <IAggregateFactory<AggregateRoot>>{
			loadFromHistory: <any>jest.fn()
		}
		repository = new Repository<AggregateRoot>(storage, factory)
	})

	describe('save', () => {

		it('should save an aggregate and reset uncommitted changes', () => {
			// Arrange
			const event = <IEvent>{ constructor: { name: 'EventCalled' } }
			const aggregate = <AggregateRoot>{
				getId: () => '1',
				getUncommittedChanges: () => [event],
				markChangesAsCommitted: <any>jest.fn()
			}

			const expectedVersion = 1

			jest.spyOn(storage, 'saveEvents')
			jest.spyOn(aggregate, 'markChangesAsCommitted')

			// Act
			repository.save(aggregate, expectedVersion)

			// Assert
			expect(storage.saveEvents).toHaveBeenCalledWith('1', [event], expectedVersion)
			expect(aggregate.markChangesAsCommitted).toHaveBeenCalled()
		})
	})

	describe('getById', () => {

		it('should get an aggregate by id', () => {
			// Arrange
			const aggregateId = '1'

			const history = [<IEvent>{ constructor: { name: 'EventCalled' } }]
			jest.spyOn(storage, 'getEventsForAggregate').mockReturnValue(history)

			const expectedAggregate = <AggregateRoot>{ constructor: { name: 'AggregateRoot' } }
			jest.spyOn(factory, 'loadFromHistory').mockReturnValue(expectedAggregate)

			// Act
			const result = repository.getById(aggregateId)

			// Assert
			expect(storage.getEventsForAggregate).toHaveBeenCalledWith(aggregateId)
			expect(factory.loadFromHistory).toHaveBeenCalledWith(history)
			expect(result).toBe(expectedAggregate)
		})
	})
})