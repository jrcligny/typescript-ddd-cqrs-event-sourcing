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
	 * Registers a command handler for a specific command name.
	 * @param commandName The name of the command to register the handler for.
	 * @param handler The command handler function.
	 * @param thisArg The instance to bind the handler to.
	 */
	registerHandler(commandName: string, handler: any, thisArg: any): void

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

	public registerHandler(commandName: string, handler: any, thisArg: any): void {
		this.handlersFor[commandName] = handler.bind(thisArg)
	}

	/**
	 * Sends a command to its corresponding command handler.
	 * @param command The command to send.
	 * @throws Error if no handler is registered for the command.
	 */
	public send<T extends ICommand>(command: T): void {
		const commandName = command.name
		if (!this.handlersFor[commandName])
		{
			throw new Error(`No handler registered for ${commandName}`)
		}

		this.handlersFor[commandName](command)
	}
}