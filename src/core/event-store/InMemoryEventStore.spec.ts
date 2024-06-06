import { InMemoryEventStore, } from './InMemoryEventStore.js'

import type { IEvent, } from '../message-bus/Event.js'
import type { IEventBus, } from '../message-bus/EventBus.js'

describe('InMemoryEventStore', () => {
	let eventStore: InMemoryEventStore
	let messageBus: IEventBus

	beforeEach(() => {
		messageBus = <IEventBus>{
			publish: <any>jest.fn()
		}
		eventStore = new InMemoryEventStore(messageBus)
	})

	describe('getEventsForAggregate', () => {

		it('should return all events for an aggregate', async () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			]
			eventStore.saveEvents(aggregateId, events, 2)

			// Act
			const result = await eventStore.getEventsForAggregate(aggregateId)

			// Assert
			expect(result).toEqual([
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			])
		})

		it('should throw an error when getting events for an aggregate that does not exist', () => {
			// Arrange
			const aggregateId = '1'

			// Act & Assert
			expect(async () => await eventStore.getEventsForAggregate(aggregateId))
				.toThrow('Aggregate not found.')
		})
	})

	describe('saveEvents', () => {

		it('should save events for an aggregate', async () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			]
			const expectedVersion = 2

			jest.spyOn(messageBus, 'publish')

			// Act
			await eventStore.saveEvents(aggregateId, events, expectedVersion)

			// Assert
			expect(messageBus.publish).toHaveBeenNthCalledWith(1, events[0])
			expect(messageBus.publish).toHaveBeenNthCalledWith(2, events[1])

			expect(eventStore.getEventsForAggregate(aggregateId)).toEqual([
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			])
		})

		it('should throw an error when saving events with an incorrect expected version', async () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			]
			await eventStore.saveEvents(aggregateId, events, 2)

			const newEvents = [
				<IEvent>{ constructor: { name: 'UnexpectedEventCalled' } },
			]
			const expectedVersion = 9

			// Act & Assert
			expect(async () => await eventStore.saveEvents(aggregateId, newEvents, expectedVersion))
				.toThrow('An operation has been performed on an aggregate root that is out of date.')
		})
	})
})