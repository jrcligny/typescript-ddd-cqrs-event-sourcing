// domain
import { ReservationCreated, } from '../domain-reservation-write/events/ReservationCreated.js'
import { GetAllReservations, } from './queries/GetAllReservations.js'
import { ReservationListRecord, } from './ReservationListRecord.js'

// framework types
import type { IEventBus, } from '../framework/EventBus.js'
import type { IQueryBus, } from '../framework/QueryBus.js'
// domain types
import type { IGetAllReservations, } from './queries/GetAllReservations.js'
import type { IReservationListRecord, } from './ReservationListRecord.js'

//#region interface
interface IReservationListView {
	// events
	registerToEventBus(eventBus: IEventBus): void
	handleReservationCreated(event: ReservationCreated): void
	// queries
	registerToQueryBus(queryBus: IQueryBus): void
	handleGetAllReservations(query: IGetAllReservations): IReservationListRecord[]
}
export type { IReservationListView }
//#endregion interface

export class ReservationListView implements IReservationListView {

	private readonly reservations: Map<string, IReservationListRecord> = new Map()

	//#region event handlers
	public registerToEventBus(eventBus: IEventBus): void {
		this.subscribeEvent(ReservationCreated.name, eventBus)
	}

	protected subscribeEvent(eventName: string, eventBus: IEventBus): void {
		const handler = this[`handle${eventName}` as keyof this]
		if (typeof handler !== 'function')
		{
			throw new Error(
				`Could not find handle${eventName} in ${this.constructor.name}.`
			)
		}
		eventBus.registerHandler(eventName, handler.bind(this))
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
