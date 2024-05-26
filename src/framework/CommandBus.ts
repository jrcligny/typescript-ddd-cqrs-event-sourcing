import type { ICommand, } from './Command.js'

/**
 * Represents a message bus that handles commands.
 * 
 * Responsible for routing messages to their corresponding handlers.
 * It allows registering command handlers for specific command names.
 * It also provides a method to send commands.
 */
interface ICommandBus {

	/**
	 * Registers command handlers for multiple command names.
	 * @param commandNames The names of the commands to register the handler for.
	 * @param commandHandler The command handler object.
	 */
	registerHandlers(
		commandNames: string[],
		handlers: any
	): void

	/**
	 * Sends a command to its corresponding command handler.
	 * @param command The command to send.
	 */
	send<T extends ICommand>(command: T): void
}
export type { ICommandBus, }

/**
 * Represents a message bus that handles events and commands.
 */
export class CommandBus implements ICommandBus {

	/**
	 * @private
	 * Stores command handlers for each command name.
	 */
	private readonly handlersFor: { [key:string]: any } = {}

	/**
	 * Registers command handlers for multiple command names.
	 * @param commandNames The names of the commands to register the handler for.
	 * @param commandHandler The command handler object. It must have a method for each command name matching the pattern handle{CommandName}.
	 * @throws Error if the handler does not have a method for the command.
	 * 
	 * @example
	 * ```typescript
	 * messageBus.registerHandlers(
	 * 	[
	 * 		'CreateOrder',
	 * 		'UpdateOrder'
	 * 	],
	 * 	{
	 * 		handleCreateOrder: (command: CreateOrder) => { ... },
	 * 		handleUpdateOrder: (command: UpdateOrder) => { ... }
	 * 	}
	 * )
	 * ```
	 */
	public registerHandlers(
		commandNames: string[],
		commandHandler: any
	): void {
		commandNames.forEach((commandName) => {
			if (!commandHandler[`handle${commandName}`])
			{
				throw new Error(
					`Could not find handle${commandName} in ${commandHandler.constructor.name}.`
				)
			}
			this.handlersFor[commandName] = commandHandler[`handle${commandName}`]
		})
	}

	/**
	 * Sends a command to its corresponding command handler.
	 * @param command The command to send.
	 * @throws Error if no handler is registered for the command.
	 */
	public send<T extends ICommand>(command: T): void {
		const commandName = command.constructor.name
		if (!this.handlersFor[commandName])
		{
			throw new Error(`No handler registered for ${commandName}`)
		}

		this.handlersFor[commandName](command)
	}
}