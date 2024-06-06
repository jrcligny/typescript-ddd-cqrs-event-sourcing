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
				<IEvent>{ name: 'EventCalled' },
				<IEvent>{ name: 'AnotherEventCalled' },
			]
			eventStore.saveEvents(aggregateId, events, 2)

			// Act
			const result = await eventStore.getEventsForAggregate(aggregateId)

			// Assert
			expect(result).toEqual([
				<IEvent>{ name: 'EventCalled' },
				<IEvent>{ name: 'AnotherEventCalled' },
			])
		})

		it('should throw an error when getting events for an aggregate that does not exist', async () => {
			// Arrange
			const aggregateId = '1'

			// Act & Assert
			expect(eventStore.getEventsForAggregate(aggregateId)).rejects.toThrow('Aggregate not found.')
		})
	})

	describe('saveEvents', () => {

		it('should save events for an aggregate', async () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ name: 'EventCalled' },
				<IEvent>{ name: 'AnotherEventCalled' },
			]
			const expectedVersion = 2

			jest.spyOn(messageBus, 'publish')

			// Act
			await eventStore.saveEvents(aggregateId, events, expectedVersion)
			const storedEvents = await eventStore.getEventsForAggregate(aggregateId)

			// Assert
			expect(messageBus.publish).toHaveBeenNthCalledWith(1, events[0])
			expect(messageBus.publish).toHaveBeenNthCalledWith(2, events[1])

			expect(storedEvents).toEqual([
				<IEvent>{ name: 'EventCalled' },
				<IEvent>{ name: 'AnotherEventCalled' },
			])
		})

		it('should throw an error when saving events with an incorrect expected version', async () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ name: 'EventCalled' },
				<IEvent>{ name: 'AnotherEventCalled' },
			]
			await eventStore.saveEvents(aggregateId, events, 2)

			const newEvents = [
				<IEvent>{ name: 'UnexpectedEventCalled' },
			]
			const expectedVersion = 9

			// Act & Assert
			expect(eventStore.saveEvents(aggregateId, newEvents, expectedVersion))
				.rejects.toThrow('An operation has been performed on an aggregate root that is out of date.');
		})
	})
})