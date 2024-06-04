// node
import { check, validationResult, matchedData, } from 'express-validator'
// framework
import { QueryBus, } from '../framework/QueryBus.js'
// domain
import { ReservationListView, } from '../domain-reservation-read/ReservationListView.js'
import { GetAllReservations, } from '../domain-reservation-read/queries/GetAllReservations.js'

// node types
import type { Express, } from 'express'
import type { Request, Response, } from 'express-serve-static-core'
// framework types
import type { IEventBus } from '../framework/EventBus.js'
// domain types
import type { IReservationListRecord } from '../domain-reservation-read/ReservationListRecord.js'
import type { IGetAllReservations, } from '../domain-reservation-read/queries/GetAllReservations.js'

export function instantiate(eventBus: IEventBus, app: Express)
{
	const queryBus = new QueryBus()
	const reservationQueryHandlers = new ReservationListView()
	reservationQueryHandlers.registerToEventBus(eventBus)
	reservationQueryHandlers.registerToQueryBus(queryBus)

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
}
