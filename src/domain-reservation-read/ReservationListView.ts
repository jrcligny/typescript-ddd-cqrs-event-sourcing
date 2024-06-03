import { ReservationCreated, } from '../domain-reservation-write/events/ReservationCreated.js'
import { GetAllReservations, } from './queries/GetAllReservations.js'
import { ReservationListRecord, } from './ReservationListRecord.js'

import type { IEventBus, } from '../framework/EventBus.js'
import type { IQueryBus, } from '../framework/QueryBus.js'
import type { IGetAllReservations, } from './queries/GetAllReservations.js'
import type { IReservationListRecord, } from './ReservationListRecord.js'

interface IReservationListView {
	// events
	registerToEventBus(eventBus: IEventBus): void
	handleReservationCreated(event: ReservationCreated): void
	// queries
	registerToQueryBus(queryBus: IQueryBus): void
	handleGetAllReservations(query: IGetAllReservations): IReservationListRecord[]
}
export type { IReservationListView }

export class ReservationListView implements IReservationListView {

	private readonly reservations: Map<string, IReservationListRecord> = new Map()

	//#region event handlers
	public registerToEventBus(eventBus: IEventBus): void {
		eventBus.registerHandler(ReservationCreated.name, this.handleReservationCreated.bind(this))
	}

	public handleReservationCreated(event: ReservationCreated): void {
		this.reservations.set(event.aggregateId, new ReservationListRecord())
	}
	//#endregion event handlers

	//#region query handlers
	public registerToQueryBus(queryBus: IQueryBus): void {
		queryBus.registerHandlers([
			GetAllReservations.name,
		], this)
	}

	public handleGetAllReservations(query: IGetAllReservations): IReservationListRecord[] {
		return Array.from(this.reservations.values())
	}
	//#endregion query handlers
}
