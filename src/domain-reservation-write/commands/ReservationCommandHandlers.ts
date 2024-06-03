import { CreateReservation, } from './CreateReservation.js'
import { SetOccupancy, } from './SetOccupancy.js'

import type { ICommandBus, } from '../../framework/CommandBus.js'
import type { IReservationFactory, } from '../ReservationFactory.js'
import type { IReservationRepository, } from '../ReservationRepository.js'

export class ReservationCommandHandlers {

	constructor(
		private readonly factory: IReservationFactory,
		private readonly repository: IReservationRepository
	) {}

	public registerToMessageBus(messageBus: ICommandBus): void {
		messageBus.registerHandlers(
			[
				CreateReservation.name,
				SetOccupancy.name
			],
			this
		)
	}

	public handleCreateReservation(command: CreateReservation): void {
		const { aggregateId, roomId, startDate, endDate, price } = command

		const reservation = this.factory.create(
			aggregateId, roomId, startDate, endDate, price
		)

		this.repository.save(reservation, -1)
	}

	public handleSetOccupancy(command: SetOccupancy): void {
		const { aggregateId, numberOfGuests, expectedAggregateVersion } = command

		const reservation = this.repository.getById(aggregateId)

		reservation.setOccupancy(numberOfGuests)
		this.repository.save(reservation, expectedAggregateVersion)
	}
}