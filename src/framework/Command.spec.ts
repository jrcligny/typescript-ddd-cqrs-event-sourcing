import { Command, } from './Command'

describe('Command', () => {

	it('should create a new instance of the Command class', () => {
		// Arrange
		const aggregateId = '1'
		const expectedAggregateVersion = 2

		// Act
		const command = new Command(aggregateId, expectedAggregateVersion)

		// Assert
		expect(command.aggregateId).toEqual(aggregateId)
		expect(command.expectedAggregateVersion).toEqual(expectedAggregateVersion)
	})
})