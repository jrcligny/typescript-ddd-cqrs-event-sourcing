// domain
import { ReservationCanceled } from '../domain-reservation-write/events/ReservationCanceled.js'
import { ReservationCreated, } from '../domain-reservation-write/events/ReservationCreated.js'
import { IsHouseAvailable, } from './queries/IsHouseAvailable.js'
import { HouseUnavailabilityRecord, } from './record/HouseUnavailabilityRecord.js'

// framework types
import type { IEventBus, } from '../framework/EventBus.js'
import type { IQueryBus, } from '../framework/QueryBus.js'
// domain types
import type { IReservationCanceled, } from '../domain-reservation-write/events/ReservationCanceled.js'
import type { IReservationCreated, } from '../domain-reservation-write/events/ReservationCreated.js'
import type { IIsHouseAvailable, } from './queries/IsHouseAvailable.js'
import type { IHouseUnavailabilityRecord, } from './record/HouseUnavailabilityRecord.js'

//#region interface
interface IHouseUnavailabilityView {
	// events
	registerToEventBus(eventBus: IEventBus): void
	handleReservationCreated(event: IReservationCreated): void
	handleReservationCanceled(event: IReservationCanceled): void
	// queries
	registerToQueryBus(queryBus: IQueryBus): void
	handleIsHouseAvailable(query: IIsHouseAvailable): boolean
}
export type { IHouseUnavailabilityView }
//#endregion interface

export class HouseUnavailabilityView implements IHouseUnavailabilityView {
	
	private readonly houseUnavailabilities: Map<string, IHouseUnavailabilityRecord> = new Map()

	//#region event handlers
	public registerToEventBus(eventBus: IEventBus): void {
		this.subscribeEvent(ReservationCreated.name, eventBus)
		this.subscribeEvent(ReservationCanceled.name, eventBus)
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
		const id = `reservation-${event.aggregateId}`
		const record = new HouseUnavailabilityRecord(
			id,
			event.houseId,
			event.arrivalDate,
			event.departureDate,
			'Rented',
		)
		this.houseUnavailabilities.set(id, record)
	}

	public handleReservationCanceled(event: IReservationCanceled): void {
		const id = `reservation-${event.aggregateId}`
		this.houseUnavailabilities.delete(id)
	}
	//#endregion event handlers

	//#region query handlers
	public registerToQueryBus(queryBus: IQueryBus): void {
		this.subscribeQuery(IsHouseAvailable.name, queryBus)
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

	public handleIsHouseAvailable(query: IIsHouseAvailable): boolean {
		const { houseId, arrivalDate, departureDate, } = query

		const houseUnavailabilities = Array.from(this.houseUnavailabilities.values())
			.filter(record => record.houseId === houseId)

		for (const record of houseUnavailabilities)
		{
			if (arrivalDate >= record.arrivalDate && arrivalDate < record.departureDate)
			{
				return false
			}
			if (departureDate > record.arrivalDate && departureDate <= record.departureDate)
			{
				return false
			}
		}

		return true
	}
	//#endregion query handlers
}
