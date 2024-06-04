// framework
import { CommandBus, } from '../framework/CommandBus.js'
import { Repository, } from '../framework/Repository.js'
// domain
import { ReservationCommandHandlers, } from '../domain-reservation-write/ReservationCommandHandlers.js'
import { ReservationFactory, } from '../domain-reservation-write/ReservationFactory.js'
import { AddAdditionalService, } from '../domain-reservation-write/commands/AddAdditionalService.js'
import { CreateReservation, } from '../domain-reservation-write/commands/CreateReservation.js'
import { RemoveAdditionalService, } from '../domain-reservation-write/commands/RemoveAdditionalService.js'
import { SetOccupancy, } from '../domain-reservation-write/commands/SetOccupancy.js'
import { SetSpecialRequest, } from '../domain-reservation-write/commands/SetSpecialRequest.js'

// node types
import type { Express, } from 'express'
import type { Request, Response, } from 'express-serve-static-core'
// framework types
import type { IEventStore, } from '../framework/EventStore.js'

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
	app.post('/reservation', (req: Request, res: Response) => {
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

	/**
	 * Register a post request to set the occupancy of a reservation
	 */
	app.post('/reservation/:id/occupancy', (req: Request, res: Response) => {
		// Extract the payload from the request body
		const payload = req.body
	
		// Create a new command with the payload
		const commandInstance = new SetOccupancy(
			req.params.id,
			payload.numberOfGuests,
			payload.expectedAggregateVersion
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})

	/**
	 * Register a post request to add an additional service to a reservation
	 */
	app.post('/reservation/:id/add-service/:service-id', (req: Request, res: Response) => {
		// Extract the payload from the request body
		const payload = req.body
	
		// Create a new command with the payload
		const commandInstance = new AddAdditionalService(
			req.params.id,
			req.params['service-id'],
			payload.name,
			payload.price,
			payload.expectedAggregateVersion
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})

	/**
	 * Register a post request to remove an additional service from a reservation
	 */
	app.post('/reservation/:id/remove-service/:service-id', (req: Request, res: Response) => {
		// Extract the payload from the request body
		const payload = req.body
	
		// Create a new command with the payload
		const commandInstance = new RemoveAdditionalService(
			req.params.id,
			req.params['service-id'],
			payload.expectedAggregateVersion
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})

	/**
	 * Register a post request to set a special request for a reservation
	 */
	app.post('/reservation/:id/special-request', (req: Request, res: Response) => {
		// Extract the payload from the request body
		const payload = req.body
	
		// Create a new command with the payload
		const commandInstance = new SetSpecialRequest(
			req.params.id,
			payload.message,
			payload.expectedAggregateVersion
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})
}
