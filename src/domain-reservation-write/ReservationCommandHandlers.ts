// domain
import { AddAdditionalService, } from './commands/AddAdditionalService.js'
import { CancelReservation, } from './commands/CancelReservation.js'
import { ConfirmReservation, } from './commands/ConfirmReservation.js'
import { CreateReservation, } from './commands/CreateReservation.js'
import { RemoveAdditionalService, } from './commands/RemoveAdditionalService.js'
import { SetOccupancy, } from './commands/SetOccupancy.js'
import { SetSpecialRequest, } from './commands/SetSpecialRequest.js'

// core types
import type { ICommandBus, } from '../core/message-bus/CommandBus.js'
// domain types
import type { IReservationFactory, } from './ReservationFactory.js'
import type { IReservationRepository, } from './ReservationRepository.js'
import type { IAddAdditionalService, } from './commands/AddAdditionalService.js'
import type { ICancelReservation } from './commands/CancelReservation.js'
import type { IConfirmReservation, } from './commands/ConfirmReservation.js'
import type { ICreateReservation, } from './commands/CreateReservation.js'
import type { IRemoveAdditionalService, } from './commands/RemoveAdditionalService.js'
import type { ISetOccupancy, } from './commands/SetOccupancy.js'
import type { ISetSpecialRequest, } from './commands/SetSpecialRequest.js'

//#region interface
interface IReservationCommandHandlers {
	registerToMessageBus(messageBus: ICommandBus): void

	handleCreateReservation(command: ICreateReservation): Promise<void>
	handleSetOccupancy(command: ISetOccupancy): Promise<void>
	handleAddAdditionalService(command: IAddAdditionalService): Promise<void>
	handleRemoveAdditionalService(command: IRemoveAdditionalService): Promise<void>
	handleSetSpecialRequest(command: ISetSpecialRequest): Promise<void>
	handleConfirmReservation(command: IConfirmReservation): Promise<void>
	handleCancelReservation(command: ICancelReservation): Promise<void>
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
		this.subscribeCommand(CancelReservation.name, commandBus)
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

	public async handleCreateReservation(command: ICreateReservation): Promise<void> {
		const { aggregateId, houseId, arrivalDate, departureDate, price } = command

		const reservation = this.factory.create(
			aggregateId, houseId, arrivalDate, departureDate, price
		)

		await this.repository.save(reservation, -1)
	}

	public async handleSetOccupancy(command: ISetOccupancy): Promise<void> {
		const { aggregateId, numberOfGuests, expectedAggregateVersion } = command

		const reservation = await this.repository.getById(aggregateId)

		reservation.setOccupancy(numberOfGuests)
		await this.repository.save(reservation, expectedAggregateVersion)
	}

	public async handleAddAdditionalService(command: IAddAdditionalService): Promise<void> {
		const { aggregateId, serviceId, name, price, expectedAggregateVersion } = command

		const reservation = await this.repository.getById(aggregateId)

		reservation.addAdditionalService(serviceId, name, price)
		await this.repository.save(reservation, expectedAggregateVersion)
	}

	public async handleRemoveAdditionalService(command: IRemoveAdditionalService): Promise<void> {
		const { aggregateId, serviceId, expectedAggregateVersion } = command

		const reservation = await this.repository.getById(aggregateId)

		reservation.removeAdditionalService(serviceId)
		await this.repository.save(reservation, expectedAggregateVersion)
	}

	public async handleSetSpecialRequest(command: ISetSpecialRequest): Promise<void> {
		const { aggregateId, specialRequest, expectedAggregateVersion } = command

		const reservation = await this.repository.getById(aggregateId)

		reservation.setSpecialRequest(specialRequest)
		await this.repository.save(reservation, expectedAggregateVersion)
	}

	public async handleConfirmReservation(command: IConfirmReservation): Promise<void> {
		const { aggregateId, expectedAggregateVersion } = command

		const reservation = await this.repository.getById(aggregateId)

		reservation.confirm()
		await this.repository.save(reservation, expectedAggregateVersion)
	}

	public async handleCancelReservation(command: ICancelReservation): Promise<void> {
		const { aggregateId, expectedAggregateVersion } = command

		const reservation = await this.repository.getById(aggregateId)

		reservation.cancel()
		await this.repository.save(reservation, expectedAggregateVersion)
	}
}