import { Event, } from './Event.js'

describe('Event', () => {

	it('should create a new instance of the Event class', () => {
		// Arrange
		const eventName = 'EventAdded'
		const aggregateId = '1'

		// Act
		const event = new Event(eventName, aggregateId)

		// Assert
		expect(event.name).toEqual(eventName)
		expect(event.aggregateId).toEqual(aggregateId)
	})
})