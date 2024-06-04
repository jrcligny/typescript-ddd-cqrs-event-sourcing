// domain
import { AdditionalServiceAdded, } from '../domain-reservation-write/events/AdditionalServiceAdded.js'
import { AdditionalServiceRemoved, } from '../domain-reservation-write/events/AdditionalServiceRemoved.js'
import { OccupancySet, } from '../domain-reservation-write/events/OccupancySet.js'
import { IReservationCreated, ReservationCreated, } from '../domain-reservation-write/events/ReservationCreated.js'
import { SpecialRequestSet, } from '../domain-reservation-write/events/SpecialRequestSet.js'
import { ReservationListRecord, } from './ReservationListRecord.js'
import { GetAllReservations, } from './queries/GetAllReservations.js'

// framework types
import type { IEventBus, } from '../framework/EventBus.js'
import type { IQueryBus, } from '../framework/QueryBus.js'
// domain types
import type { IAdditionalServiceAdded } from '../domain-reservation-write/events/AdditionalServiceAdded.js'
import type { IAdditionalServiceRemoved } from '../domain-reservation-write/events/AdditionalServiceRemoved.js'
import type { IOccupancySet, } from '../domain-reservation-write/events/OccupancySet.js'
import type { ISpecialRequestSet, } from '../domain-reservation-write/events/SpecialRequestSet.js'
import type { IReservationListRecord, } from './ReservationListRecord.js'
import type { IGetAllReservations, } from './queries/GetAllReservations.js'

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
		this.subscribeEvent(AdditionalServiceAdded.name, eventBus)
		this.subscribeEvent(AdditionalServiceRemoved.name, eventBus)
		this.subscribeEvent(OccupancySet.name, eventBus)
		this.subscribeEvent(SpecialRequestSet.name, eventBus)
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

	public handleReservationCreated(event: IReservationCreated): void {
		this.reservations.set(event.aggregateId, new ReservationListRecord(
			event.aggregateId,
			event.houseId,
			undefined, // guestId
			event.startDate,
			event.endDate,
			event.price,
			1, // numberOfGuests
			false, // hasSpecialRequest
			0, // numberOfAdditionalServices
		))
	}

	public handleAdditionalServiceAdded(event: IAdditionalServiceAdded): void {
		const reservation = this.reservations.get(event.aggregateId)
		if (reservation)
		{
			reservation.numberOfAdditionalServices += 1
		}
	}

	public handleAdditionalServiceRemoved(event: IAdditionalServiceRemoved): void {
		const reservation = this.reservations.get(event.aggregateId)
		if (reservation)
		{
			reservation.numberOfAdditionalServices -= 1
		}
	}

	public handleOccupancySet(event: IOccupancySet): void {
		const reservation = this.reservations.get(event.aggregateId)
		if (reservation)
		{
			reservation.numberOfGuests = event.numberOfGuests
		}
	}

	public handleSpecialRequestSet(event: ISpecialRequestSet): void {
		const reservation = this.reservations.get(event.aggregateId)
		if (reservation)
		{
			reservation.hasSpecialRequest = event.message ? true : false
		}
	}
	//#endregion event handlers

	//#region query handlers
	public registerToQueryBus(queryBus: IQueryBus): void {
		this.subscribeQuery(GetAllReservations.name, queryBus)
	}

	protected subscribeQuery(queryName: string, queryBus: IQueryBus): void {
		const handler = this[`handle${queryName}` as keyof this]
		if (typeof handler !== 'function')
		{
			throw new Error(
				`Could not find handle${queryName} in ${this.constructor.name}.`
			)
		}
		queryBus.registerHandler(queryName, this[`handle${queryName}` as keyof this], this)
	}

	public handleGetAllReservations(query: IGetAllReservations): IReservationListRecord[] {
		return Array.from(this.reservations.values()).filter((reservation) =>{
			if (query.houseId && reservation.houseId !== query.houseId)
			{
				return false
			}
			if (query.arrivalDateFrom && reservation.arrivalDate <= query.arrivalDateFrom)
			{
				return false
			}
			if (query.arrivalDateTo && reservation.arrivalDate >= query.arrivalDateTo)
			{
				return false
			}
			return true
		})
	}
	//#endregion query handlers
}
