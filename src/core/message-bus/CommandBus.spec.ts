import { CommandBus, } from './CommandBus'

import type { ICommand, } from './Command'

describe('CommandBus', () => {
	let messageBus: CommandBus

	beforeEach(() => {
		messageBus = new CommandBus()
	})

	describe('registerHandler', () => {

		it('should register command handler', () => {
			// Arrange
			const commandHandler = {
				handleTestCommand1: function handleTestCommand1() {},
				handleTestCommand2: function handleTestCommand2() {}
			}
			const thisArg = {}

			// Act
			messageBus.registerHandler('TestCommand1', commandHandler.handleTestCommand1, thisArg)
			messageBus.registerHandler('TestCommand2', commandHandler.handleTestCommand2, thisArg)

			// Assert
			expect(messageBus['handlersFor']['TestCommand1'].name).toBe('bound handleTestCommand1')
			expect(messageBus['handlersFor']['TestCommand2'].name).toBe('bound handleTestCommand2')
		})
	})

	describe('send', () => {

		it('should send a command', () => {
			// Arrange
			const command = <ICommand>{  name: 'TestCommand' }
			const commandHandler = jest.fn()
			messageBus.registerHandler('TestCommand', commandHandler, {})

			// Act
			messageBus.send(command)

			// Assert
			expect(commandHandler).toHaveBeenCalledWith(command)
		})

		it('should throw an error if no handler is found', () => {
			// Arrange
			const command = <ICommand>{  name: 'TestCommand' }

			// Act & Assert
			expect(() => messageBus.send(command)).toThrow(
				`No handler registered for TestCommand`
			)
		})
	})
})