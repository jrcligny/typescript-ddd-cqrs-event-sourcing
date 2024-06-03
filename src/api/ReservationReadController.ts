import type { Express } from 'express'
// framework
import { IEventBus } from '../framework/EventBus.js'
import { QueryBus, } from '../framework/QueryBus.js'
// domain-reservation
import type { IReservationListRecord } from '../domain-reservation-read/ReservationListRecord.js'
import { ReservationListView, } from '../domain-reservation-read/ReservationListView.js'
import { GetAllReservations, IGetAllReservations, } from '../domain-reservation-read/queries/GetAllReservations.js'

export function instantiate(eventBus: IEventBus, app: Express)
{
	const queryBus = new QueryBus()
	const reservationQueryHandlers = new ReservationListView()
	reservationQueryHandlers.registerToEventBus(eventBus)
	reservationQueryHandlers.registerToQueryBus(queryBus)

	/**
	 * Register a get request to get all reservations
	 */
	app.get('/reservations', async (req: any, res: any) => {
	
		// Get the reservation from the repository
		const reservation = await queryBus.send<IGetAllReservations, IReservationListRecord[]>(new GetAllReservations())
		
		// Send a response
		res.json(reservation)
	})
}
