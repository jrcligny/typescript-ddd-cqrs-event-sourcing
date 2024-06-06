import { EventBus, } from './EventBus'

import type { IEvent, } from './Event'

describe('EventBus', () => {
	let messageBus: EventBus

	beforeEach(() => {
		messageBus = new EventBus()
	})

	describe('registerHandler', () => {

		it('should register event handler', () => {
			// Arrange
			const event = <IEvent>{ constructor: { name: 'EventCalled' } }
			const handler = jest.fn()

			// Act
			messageBus.registerHandler('EventCalled', handler)
			messageBus.registerHandler('EventCalled', handler)

			// Assert
			expect(messageBus['handlerFor']['EventCalled'][0]).toBe(handler)
			expect(messageBus['handlerFor']['EventCalled'][1]).toBe(handler)
		})
	})

	describe('publish', () => {

		it('should publish an event and invoke all registered event handlers', () => {
			// Arrange
			const event = <IEvent>{ constructor: { name: 'EventCalled' } }
			const handler1 = jest.fn()
			const handler2 = jest.fn()
			messageBus.registerHandler('EventCalled', handler1)
			messageBus.registerHandler('EventCalled', handler2)

			// Act
			messageBus.publish(event)

			// Assert
			expect(handler1).toHaveBeenCalledWith(event)
			expect(handler2).toHaveBeenCalledWith(event)
		})

		it('should not throw an error if no handler is found', () => {
			// Arrange
			const event = <IEvent>{ constructor: { name: 'EventCalled' } }

			// Act & Assert
			expect(() => messageBus.publish(event)).not.toThrow()
		})
	})
})