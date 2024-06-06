import { EventStore, } from './EventStore.js'

import type { IEvent, } from '../message-bus/Event.js'
import type { IEventBus, } from '../message-bus/EventBus.js'

describe('EventStore', () => {
	let eventStore: EventStore
	let messageBus: IEventBus

	beforeEach(() => {
		messageBus = <IEventBus>{
			publish: <any>jest.fn()
		}
		eventStore = new EventStore(messageBus)
	})

	describe('getEventsForAggregate', () => {

		it('should return all events for an aggregate', () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			]
			eventStore.saveEvents(aggregateId, events, 2)

			// Act
			const result = eventStore.getEventsForAggregate(aggregateId)

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
			expect(() => eventStore.getEventsForAggregate(aggregateId))
				.toThrow('Aggregate not found.')
		})
	})

	describe('saveEvents', () => {

		it('should save events for an aggregate', () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			]
			const expectedVersion = 2

			jest.spyOn(messageBus, 'publish')

			// Act
			eventStore.saveEvents(aggregateId, events, expectedVersion)

			// Assert
			expect(messageBus.publish).toHaveBeenNthCalledWith(1, events[0])
			expect(messageBus.publish).toHaveBeenNthCalledWith(2, events[1])

			expect(eventStore.getEventsForAggregate(aggregateId)).toEqual([
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			])
		})

		it('should throw an error when saving events with an incorrect expected version', () => {
			// Arrange
			const aggregateId = '1'
			const events = [
				<IEvent>{ constructor: { name: 'EventCalled' } },
				<IEvent>{ constructor: { name: 'AnotherEventCalled' } },
			]
			eventStore.saveEvents(aggregateId, events, 2)

			const newEvents = [
				<IEvent>{ constructor: { name: 'UnexpectedEventCalled' } },
			]
			const expectedVersion = 9

			// Act & Assert
			expect(() => eventStore.saveEvents(aggregateId, newEvents, expectedVersion))
				.toThrow('An operation has been performed on an aggregate root that is out of date.')
		})
	})
})