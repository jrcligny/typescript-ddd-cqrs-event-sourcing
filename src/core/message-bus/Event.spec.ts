import { Event, } from './Event.js'

describe('Event', () => {

	it('should create a new instance of the Event class', () => {
		// Arrange
		const aggregateId = '1'

		// Act
		const event = new Event(aggregateId)

		// Assert
		expect(event.aggregateId).toEqual(aggregateId)
	})
})