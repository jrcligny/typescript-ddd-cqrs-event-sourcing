// domain
import { AddAdditionalService, } from './commands/AddAdditionalService.js'
import { CreateReservation, } from './commands/CreateReservation.js'
import { RemoveAdditionalService, } from './commands/RemoveAdditionalService.js'
import { SetOccupancy, } from './commands/SetOccupancy.js'
import { SetSpecialRequest, } from './commands/SetSpecialRequest.js'

// framework types
import type { ICommandBus, } from '../framework/CommandBus.js'
// domain types
import type { IReservationFactory, } from './ReservationFactory.js'
import type { IReservationRepository, } from './ReservationRepository.js'
import type { IAddAdditionalService, } from './commands/AddAdditionalService.js'
import type { ICreateReservation, } from './commands/CreateReservation.js'
import type { IRemoveAdditionalService, } from './commands/RemoveAdditionalService.js'
import type { ISetOccupancy, } from './commands/SetOccupancy.js'
import type { ISetSpecialRequest, } from './commands/SetSpecialRequest.js'

//#region interface
interface IReservationCommandHandlers {
	registerToMessageBus(messageBus: ICommandBus): void

	handleCreateReservation(command: ICreateReservation): void
	handleSetOccupancy(command: ISetOccupancy): void
	handleAddAdditionalService(command: IAddAdditionalService): void
	handleRemoveAdditionalService(command: IRemoveAdditionalService): void
	handleSetSpecialRequest(command: ISetSpecialRequest): void
}
export type { IReservationCommandHandlers }
//#endregion interface

export class ReservationCommandHandlers implements IReservationCommandHandlers {

	constructor(
		private readonly factory: IReservationFactory,
		private readonly repository: IReservationRepository
	) {}

	public registerToMessageBus(commandBus: ICommandBus): void {
		this.subscribeCommand(CreateReservation.name, commandBus)
		this.subscribeCommand(SetOccupancy.name, commandBus)
		this.subscribeCommand(AddAdditionalService.name, commandBus)
		this.subscribeCommand(RemoveAdditionalService.name, commandBus)
		this.subscribeCommand(SetSpecialRequest.name, commandBus)
	}

	protected subscribeCommand(commandName: string, commandBus: ICommandBus): void {
		const handler = this[`handle${commandName}` as keyof this]
		if (typeof handler !== 'function')
		{
			throw new Error(
				`Could not find handle${commandName} in ${this.constructor.name}.`
			)
		}
		commandBus.registerHandler(commandName, this[`handle${commandName}` as keyof this], this)
	}

	public handleCreateReservation(command: ICreateReservation): void {
		const { aggregateId, roomId, startDate, endDate, price } = command

		const reservation = this.factory.create(
			aggregateId, roomId, startDate, endDate, price
		)

		this.repository.save(reservation, -1)
	}

	public handleSetOccupancy(command: ISetOccupancy): void {
		const { aggregateId, numberOfGuests, expectedAggregateVersion } = command

		const reservation = this.repository.getById(aggregateId)

		reservation.setOccupancy(numberOfGuests)
		this.repository.save(reservation, expectedAggregateVersion)
	}

	public handleAddAdditionalService(command: IAddAdditionalService): void {
		const { aggregateId, serviceId, name, price, expectedAggregateVersion } = command

		const reservation = this.repository.getById(aggregateId)

		reservation.addAdditionalService(serviceId, name, price)
		this.repository.save(reservation, expectedAggregateVersion)
	}

	public handleRemoveAdditionalService(command: IRemoveAdditionalService): void {
		const { aggregateId, serviceId, expectedAggregateVersion } = command

		const reservation = this.repository.getById(aggregateId)

		reservation.removeAdditionalService(serviceId)
		this.repository.save(reservation, expectedAggregateVersion)
	}

	public handleSetSpecialRequest(command: ISetSpecialRequest): void {
		const { aggregateId, specialRequest, expectedAggregateVersion } = command

		const reservation = this.repository.getById(aggregateId)

		reservation.setSpecialRequest(specialRequest)
		this.repository.save(reservation, expectedAggregateVersion)
	}
}