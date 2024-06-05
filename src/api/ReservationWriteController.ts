// node
import { body, matchedData, validationResult, } from 'express-validator'
// framework
import { CommandBus, } from '../framework/CommandBus.js'
import { Repository, } from '../framework/Repository.js'
// domain
import { ReservationCommandHandlers, } from '../domain-reservation-write/ReservationCommandHandlers.js'
import { ReservationFactory, } from '../domain-reservation-write/ReservationFactory.js'
import { AddAdditionalService, } from '../domain-reservation-write/commands/AddAdditionalService.js'
import { CancelReservation, } from '../domain-reservation-write/commands/CancelReservation.js'
import { ConfirmReservation, } from '../domain-reservation-write/commands/ConfirmReservation.js'
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
	app.post('/reservation', [
		body('houseId').isString().withMessage('houseId must be a string'),
		body('arrivalDate').isISO8601().withMessage('arrivalDate must be a date').toDate(),
		body('departureDate').isISO8601().withMessage('departureDate must be a date').toDate(),
		body('price').isNumeric().withMessage('price must be a number'),
	], (req: Request, res: Response) => {

		// Validate the request
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// Retrieve validated data from the body
		const payload = matchedData(req)
	
		// Generate a unique identifier for the reservation
		const reservationId = Math.random().toString(36).substr(2, 9)
	
		// Create a new command with the payload
		const commandInstance = new CreateReservation(
			reservationId,
			payload.houseId,
			payload.arrivalDate,
			payload.departureDate,
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
	app.post('/reservation/:id/occupancy', [
		body('numberOfGuests').isInt().withMessage('numberOfGuests must be an integer'),
		body('expectedAggregateVersion').isInt().withMessage('expectedAggregateVersion must be an integer'),
	], (req: Request, res: Response) => {

		// Validate the request
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// Retrieve validated data from the body
		const payload = matchedData(req)
	
		// Create a new command with the payload
		const commandInstance = new SetOccupancy(
			payload.id,
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
	app.post('/reservation/:id/add-service/:service-id', [
		body('name').isString().withMessage('name must be a string'),
		body('price').isNumeric().withMessage('price must be a number'),
		body('service-id').isString().withMessage('service-id must be a string'),
		body('expectedAggregateVersion').isInt().withMessage('expectedAggregateVersion must be an integer'),
	], (req: Request, res: Response) => {

		// Validate the request
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// Retrieve validated data from the body
		const payload = matchedData(req)
	
		// Create a new command with the payload
		const commandInstance = new AddAdditionalService(
			payload.id,
			payload['service-id'],
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
	app.post('/reservation/:id/remove-service/:service-id', [
		body('service-id').isString().withMessage('service-id must be a string'),
		body('expectedAggregateVersion').isInt().withMessage('expectedAggregateVersion must be an integer'),
	], (req: Request, res: Response) => {

		// Validate the request
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// Retrieve validated data from the body
		const payload = matchedData(req)
	
		// Create a new command with the payload
		const commandInstance = new RemoveAdditionalService(
			payload.id,
			payload['service-id'],
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
	app.post('/reservation/:id/special-request', [
		body('message').isString().withMessage('message must be a string'),
		body('expectedAggregateVersion').isInt().withMessage('expectedAggregateVersion must be an integer'),
	], (req: Request, res: Response) => {

		// Validate the request
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// Retrieve validated data from the body
		const payload = matchedData(req)
	
		// Create a new command with the payload
		const commandInstance = new SetSpecialRequest(
			payload.id,
			payload.message,
			payload.expectedAggregateVersion
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})

	/**
	 * Register a post request to confirm a reservation
	 */
	app.post('/reservation/:id/confirm', [
		body('expectedAggregateVersion').isInt().withMessage('expectedAggregateVersion must be an integer'),
	], (req: Request, res: Response) => {

		// Validate the request
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// Retrieve validated data from the body
		const payload = matchedData(req)
		
		// Create a new command with the payload
		const commandInstance = new ConfirmReservation(
			payload.id,
			payload.expectedAggregateVersion
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})

	/**
	 * Register a post request to cancel a reservation
	 */
	app.post('/reservation/:id/cancel', [
		body('expectedAggregateVersion').isInt().withMessage('expectedAggregateVersion must be an integer'),
	], (req: Request, res: Response) => {

		// Validate the request
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		// Retrieve validated data from the body
		const payload = matchedData(req)

		// Create a new command with the payload
		const commandInstance = new CancelReservation(
			payload.id,
			payload.expectedAggregateVersion
		)
	
		// Send the command to the command bus
		commandBus.send(commandInstance)
	
		// Send a response
		res.json({ message: 'Request has been sent successfully' })
	})
}
