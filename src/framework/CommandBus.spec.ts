import { CommandBus, } from './CommandBus'

import type { ICommand, } from './Command'

describe('CommandBus', () => {
	let messageBus: CommandBus

	beforeEach(() => {
		messageBus = new CommandBus()
	})

	describe('registerCommandHandlers', () => {

		it('should register command handlers', () => {
			// Arrange
			const commandNames = ['TestCommand1', 'TestCommand2']
			const commandHandler = { handleTestCommand1: jest.fn(), handleTestCommand2: jest.fn() }

			// Act
			messageBus.registerHandlers(commandNames, commandHandler)

			// Assert
			expect(messageBus['handlersFor']['TestCommand1']).toBe(commandHandler.handleTestCommand1)
			expect(messageBus['handlersFor']['TestCommand2']).toBe(commandHandler.handleTestCommand2)
		})

		it('should throw an error if a handler is not found', () => {
			// Arrange
			const commandNames = ['TestCommand']
			const commandHandler = { constructor: { name: 'CommandHandler'} }

			// Act & Assert
			expect(() => messageBus.registerHandlers(commandNames, commandHandler)).toThrow(
				`Could not find handleTestCommand in CommandHandler.`
			)
		})
	})

	describe('send', () => {

		it('should send a command', () => {
			// Arrange
			const command = <ICommand>{ constructor: { name: 'TestCommand' } }
			const commandHandler = { handleTestCommand: jest.fn() }
			messageBus.registerHandlers(['TestCommand'], commandHandler)

			// Act
			messageBus.send(command)

			// Assert
			expect(commandHandler.handleTestCommand).toHaveBeenCalledWith(command)
		})

		it('should throw an error if no handler is found', () => {
			// Arrange
			const command = <ICommand>{ constructor: { name: 'TestCommand' } }

			// Act & Assert
			expect(() => messageBus.send(command)).toThrow(
				`No handler registered for TestCommand`
			)
		})
	})
})