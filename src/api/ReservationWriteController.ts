import type { Express } from 'express'
// framework
import type { IEventStore } from '../framework/EventStore.js'
import { CommandBus, } from '../framework/CommandBus.js'
import { Repository, } from '../framework/Repository.js'
// domain-reservation
import { ReservationCommandHandlers, } from '../domain-reservation-write/commands/ReservationCommandHandlers.js'
import { CreateReservation, } from '../domain-reservation-write/commands/CreateReservation.js'
import { ReservationFactory, } from '../domain-reservation-write/ReservationFactory.js'

export function instanciate(eventStore: IEventStore, app: Express)
{
	const reservationFactory = new ReservationFactory()
	const reservationRepository = new Repository(eventStore, reservationFactory)
	const reservationCommandHandlers = new ReservationCommandHandlers(reservationFactory, reservationRepository)
	const commandBus = new CommandBus()
	reservationCommandHandlers.registerToMessageBus(commandBus)
	
	/**
	 * Register a post request to create a reservation
	 */
	app.post('/reservation', (req: any, res: any) => {
		// Extract the payload from the request body
		const payload = req.body
	
		// Generate a unique identifier for the reservation
		const reservationId = Math.random().toString(36).substr(2, 9)
	
		// Create a new command with the payload
		const commandInstance = new CreateReservation(
			reservationId,
			payload.roomId,
			payload.startDate,
			payload.endDate,
			payload.price
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})
}
