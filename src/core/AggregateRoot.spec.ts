import { AggregateRoot, } from './AggregateRoot.js'

import type { IEvent, } from './message-bus/Event.js'

class TestAggregateRoot extends AggregateRoot {
	callEvent(): void
	{
		const event = <IEvent>{ constructor: { name: 'EventCalled' } }
		this.applyChange(event)
	}
	applyEventCalled(event: IEvent) {
		// Apply event logic here
	}
	callUnknowEvent(): void
	{
		const event = <IEvent>{ constructor: { name: 'UnknownEvent' } }
		this.applyChange(event)
	}
}

describe('AggregateRoot', () => {
	let aggregateRoot: TestAggregateRoot

	beforeEach(() => {
		aggregateRoot = new TestAggregateRoot()
	})

	describe('applyChange', () => {

		it('should apply the change and increment the version', () => {
			// Arrange
			const event = <IEvent>{ constructor: { name: 'EventCalled' } }
			const spyOnApplyEventCalled = jest.spyOn(<any>aggregateRoot, 'applyEventCalled')

			// Act
			aggregateRoot.callEvent()

			// Assert
			expect(aggregateRoot.getVersion()).toEqual(1)
			expect(aggregateRoot.getUncommittedChanges()).toContainEqual(event)
			expect(spyOnApplyEventCalled).toHaveBeenCalledWith(event)
		})

		it('should throw an error if no handler is found for the event', () => {
			// Arrange

			// Act & Assert
			expect(() => aggregateRoot.callUnknowEvent()).toThrow(
				`No handler found for UnknownEvent. Be sure to define a method called applyUnknownEvent on the aggregate.`
			)

			expect(aggregateRoot.getVersion()).toEqual(0)
			expect(aggregateRoot.getUncommittedChanges()).toEqual([])
		})
	})

	describe('loadFromHistory', () => {

		it('should apply the changes from the history', () => {
			// Arrange
			const event1 = <IEvent>{ constructor: { name: 'EventCalled' } }
			const event2 = <IEvent>{ constructor: { name: 'EventCalled' } }
			const event3 = <IEvent>{ constructor: { name: 'EventCalled' } }
			const history = [event1, event2, event3]
			const spyOnApplyEventCalled = jest.spyOn(<any>aggregateRoot, 'applyEventCalled')

			// Act
			aggregateRoot.loadFromHistory(history)

			// Assert
			expect(aggregateRoot.getVersion()).toEqual(3)
			expect(aggregateRoot.getUncommittedChanges()).toEqual([])
			expect(spyOnApplyEventCalled).toHaveBeenCalledTimes(3)
			expect(spyOnApplyEventCalled).toHaveBeenNthCalledWith(1, event1)
			expect(spyOnApplyEventCalled).toHaveBeenNthCalledWith(2, event2)
			expect(spyOnApplyEventCalled).toHaveBeenNthCalledWith(3, event3)
		})
		
		it('should throw an error if no handler is found for an event in the history', () => {
			// Arrange
			const event1 = <IEvent>{ constructor: { name: 'EventCalled' } }
			const event2 = <IEvent>{ constructor: { name: 'UnknownEvent' } }
			const event3 = <IEvent>{ constructor: { name: 'EventCalled' } }
			const history = [event1, event2, event3]

			// Act & Assert
			expect(() => aggregateRoot.loadFromHistory(history)).toThrow(
				`No handler found for UnknownEvent. Be sure to define a method called applyUnknownEvent on the aggregate.`
			)

			expect(aggregateRoot.getVersion()).toEqual(1)
			expect(aggregateRoot.getUncommittedChanges()).toEqual([])
		})
	})

	describe('markChangesAsCommitted', () => {

		it('should clear the uncommitted changes', () => {
			// Arrange
			const event = <IEvent>{ constructor: { name: 'EventCalled' } }
			aggregateRoot.callEvent()

			// Act
			aggregateRoot.markChangesAsCommitted()

			// Assert
			expect(aggregateRoot.getUncommittedChanges()).toEqual([])
		})
	})
})