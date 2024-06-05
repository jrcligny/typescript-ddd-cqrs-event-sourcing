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
import { ReservationCanceled } from './events/ReservationCanceled.js'
import { ReservationConfirmed } from './events/ReservationConfirmed.js'

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
	arrivalDate: Date
	departureDate: Date
	price: number
	numberOfGuests: number
	additionalServices: { id: string; name: string; price: number; }[]
	specialRequest: string | undefined
	status: 'created' | 'confirmed' | 'canceled'

	create(id: string, houseId: string, arrivalDate: Date, departureDate: Date, price: number): void
	setOccupancy(numberOfGuests: number): void
	addAdditionalService(serviceId: string, name: string, price: number): void
	removeAdditionalService(serviceId: string): void
	setSpecialRequest(message: string): void
	confirm(): void
	cancel(): void
}
export type { IReservation }
//#endregion interface

export class Reservation extends AggregateRoot implements IReservation
{
	public guestId: string | undefined
	public houseId!: string
	public arrivalDate!: Date
	public departureDate!: Date
	public price!: number
	public status: 'created' | 'confirmed' | 'canceled' = 'created'

	public numberOfGuests: number = 0
	public readonly additionalServices: { id: string; name: string; price: number; }[] = []
	public specialRequest: string | undefined

	//#region create
	public create(
		id: string,
		houseId: string,
		arrivalDate: Date,
		departureDate: Date,
		price: number
	): void {
		this.applyChange(new ReservationCreated(id, houseId, arrivalDate, departureDate, price))
	}
	protected applyReservationCreated(event: IReservationCreated): void
	{
		this.id = event.aggregateId
		this.houseId = event.houseId
		this.arrivalDate = event.arrivalDate
		this.departureDate = event.departureDate
		this.price = event.price
		this.status = 'created'
		this.numberOfGuests = 1
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

	//#region confirm
	public confirm(): void
	{
		if (this.status === 'confirmed')
		{
			throw new Error('The reservation has already been confirmed')
		}
		if (this.status === 'canceled')
		{
			throw new Error('The reservation has been canceled and cannot be confirmed')
		}
		this.applyChange(new ReservationConfirmed(this.id))
	}
	protected applyReservationConfirmed(event: ReservationConfirmed): void
	{
		this.status = 'confirmed'
	}
	//#endregion confirm

	//#region cancel
	public cancel(): void
	{
		if (this.status === 'canceled')
		{
			throw new Error('The reservation has already been canceled')
		}
		this.applyChange(new ReservationCanceled(this.id))
	}
	protected applyReservationCanceled(event: ReservationCanceled): void
	{
		this.status = 'canceled'
	}
	//#endregion cancel
}
