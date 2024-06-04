// framework
import { AggregateRoot, } from '../framework/AggregateRoot.js'
// domain
import { AdditionalServiceAdded, } from './events/AdditionalServiceAdded.js'
import { AdditionalServiceRemoved, } from './events/AdditionalServiceRemoved.js'
import { OccupancySet, } from './events/OccupancySet.js'
import { ReservationCreated, } from './events/ReservationCreated.js'
import { SpecialRequestSet, } from './events/SpecialRequestSet.js'

// domain types
import type { IAdditionalServiceAdded, } from './events/AdditionalServiceAdded.js'
import type { IAdditionalServiceRemoved, } from './events/AdditionalServiceRemoved.js'
import type { IOccupancySet, } from './events/OccupancySet.js'
import type { IReservationCreated, } from './events/ReservationCreated.js'
import type { ISpecialRequestSet, } from './events/SpecialRequestSet.js'

//#region interface
/**
 * This class is used to create a reservation object
 *
 * A reservation is associated to a house, a guest and a period
 * 
 * Some additional information can be added to the reservation:
 * - the number of guests (children and adults)
 * - the price of the reservation
 * - any special request
 * - a list of additional services
 */
interface IReservation {
	guestId: string | undefined
	houseId: string
	startDate: Date
	endDate: Date
	price: number
	numberOfGuests: number
	additionalServices: { id: string; name: string; price: number; }[]
	specialRequest: string | undefined

	create(id: string, houseId: string, startDate: Date, endDate: Date, price: number): void
	setOccupancy(numberOfGuests: number): void
	addAdditionalService(serviceId: string, name: string, price: number): void
	removeAdditionalService(serviceId: string): void
	setSpecialRequest(message: string): void
}
export type { IReservation }
//#endregion interface

export class Reservation extends AggregateRoot implements IReservation
{
	public guestId: string | undefined
	public houseId!: string
	public startDate!: Date
	public endDate!: Date
	public price!: number

	public numberOfGuests: number = 1
	public readonly additionalServices: { id: string; name: string; price: number; }[] = []
	public specialRequest: string | undefined

	//#region create
	public create(
		id: string,
		houseId: string,
		startDate: Date,
		endDate: Date,
		price: number
	): void {
		this.applyChange(new ReservationCreated(id, houseId, startDate, endDate, price))
	}
	protected applyReservationCreated(event: IReservationCreated): void
	{
		this.id = event.aggregateId
		this.houseId = event.houseId
		this.startDate = event.startDate
		this.endDate = event.endDate
		this.price = event.price
	}
	//#endregion create

	//#region set-occupancy
	public setOccupancy(numberOfGuests: number): void
	{
		this.applyChange(new OccupancySet(this.id, numberOfGuests))
	}
	protected applyOccupancySet(event: IOccupancySet): void
	{
		this.numberOfGuests = event.numberOfGuests
	}
	//#endregion set-occupancy

	//#region add-additional-service
	public addAdditionalService(serviceId: string, name: string, price: number): void
	{
		if (this.additionalServices.some(service => service.id === serviceId))
		{
			throw new Error('The additional service has already been added')
		}
		this.applyChange(new AdditionalServiceAdded(this.id, serviceId, name, price))
	}
	protected applyAdditionalServiceAdded(event: IAdditionalServiceAdded): void
	{
		this.additionalServices.push({ id: event.serviceId, name: event.name, price: event.price })
	}
	//#endregion add-additional-service

	//#region remove-additional-service
	public removeAdditionalService(serviceId: string): void
	{
		this.applyChange(new AdditionalServiceRemoved(this.id, serviceId))
	}
	protected applyAdditionalServiceRemoved(event: IAdditionalServiceRemoved): void
	{
		const index = this.additionalServices.findIndex(service => service.id === event.serviceId)
		if (index !== -1)
		{
			this.additionalServices.splice(index, 1)
		}
	}
	//#endregion remove-additional-service

	//#region set-special-request
	public setSpecialRequest(message: string): void
	{
		this.applyChange(new SpecialRequestSet(this.id, message))
	}
	protected applySpecialRequestSet(event: ISpecialRequestSet): void
	{
		this.specialRequest = event.message
	}
	//#endregion set-special-request
}
