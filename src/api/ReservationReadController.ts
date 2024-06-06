// node
import { check, matchedData, validationResult, } from 'express-validator'
// core
import { QueryBus, } from '../core/message-bus/QueryBus.js'
// domain
import { HouseUnavailabilityView } from '../domain-reservation-read/HouseUnavailabilityView.js'
import { ReservationListView, } from '../domain-reservation-read/ReservationListView.js'
import { GetAllReservations, } from '../domain-reservation-read/queries/GetAllReservations.js'
import { IsHouseAvailable, } from '../domain-reservation-read/queries/IsHouseAvailable.js'

// node types
import type { Express, } from 'express'
import type { Request, Response, } from 'express-serve-static-core'
// core types
import type { IEventBus } from '../core/message-bus/EventBus.js'
// domain types
import type { IReservationListRecord } from '../domain-reservation-read/record/ReservationListRecord.js'
import type { IGetAllReservations, } from '../domain-reservation-read/queries/GetAllReservations.js'
import type { IIsHouseAvailable, } from '../domain-reservation-read/queries/IsHouseAvailable.js'

export function instantiate(eventBus: IEventBus, app: Express)
{
	const queryBus = new QueryBus()
	const reservationQueryHandlers = new ReservationListView()
	reservationQueryHandlers.registerToEventBus(eventBus)
	reservationQueryHandlers.registerToQueryBus(queryBus)
	const houseUnavailabilityView = new HouseUnavailabilityView()
	houseUnavailabilityView.registerToEventBus(eventBus)
	houseUnavailabilityView.registerToQueryBus(queryBus)

	/**
	 * Register a get request to get all reservations
	 */
	app.get('/reservations/', [
		check('houseId').optional().isString().withMessage('Invalid houseId'),
		check('arrivalDateFrom').optional().isISO8601().withMessage('Invalid arrivalDateFrom').toDate(),
		check('arrivalDateTo').optional().isISO8601().withMessage('Invalid arrivalDateTo').toDate(),
	], async (req: Request, res: Response) => {

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const validData: {
			houseId?: string
			arrivalDateFrom?: Date
			arrivalDateTo?: Date
		} = matchedData(req)

		// Get the reservation from the repository
		const reservation = await queryBus.send<IGetAllReservations, IReservationListRecord[]>(new GetAllReservations(
			validData.houseId,
			validData.arrivalDateFrom,
			validData.arrivalDateTo
		))

		// Send a response
		res.json(reservation)
	})

	/**
	 * Register a get request to check if a house is available
	 */
	app.get('/house/:id/availability', [
		check('id').isString().withMessage('Invalid id'),
		check('arrivalDate').isISO8601().withMessage('Invalid arrivalDate').toDate(),
		check('departureDate').isISO8601().withMessage('Invalid departureDate').toDate(),
	], async (req: Request, res: Response) => {

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const validData: {
			id: string
			arrivalDate: Date
			departureDate: Date
		} = matchedData(req)

		// Get the reservation from the repository
		const isHouseAvailable = await queryBus.send<IIsHouseAvailable, boolean>(new IsHouseAvailable(
			validData.id,
			validData.arrivalDate,
			validData.departureDate
		))

		// Send a response
		res.json(isHouseAvailable)
	})
}
