/**
 * This class is used to create a reservation object
 *
 * A reservation is associated to a house, a guest and a period
 * 
 * Some additional information can be added to the reservation:
 * - the number of guests (children and adults)
 * - the price of the reservation
 * - the status of the reservation (pending, confirmed, cancelled)
 * - the payment method
 * - the payment status (paid, not paid)
 * - the payment date
 * - any special request
 * - a list of additional services
 */

import { AggregateRoot, } from '../framework/AggregateRoot.js'
import { AdditionalServiceAdded, } from './events/AdditionalServiceAdded.js'
import { AdditionalServiceRemoved, } from './events/AdditionalServiceRemoved.js'
import { OccupancySet, } from './events/OccupancySet.js'
import { ReservationCreated, } from './events/ReservationCreated.js'
import { SpecialRequestSet, } from './events/SpecialRequestSet.js'

export class Reservation extends AggregateRoot
{
	public guestId: string | undefined
	public houseId!: string
	public startDate!: Date
	public endDate!: Date
	public price!: number

	public numberOfGuests: number = 1
	private status: string = 'pending'
	private paymentMethod: string = 'credit card'
	private paymentStatus: string = 'not paid'
	private paymentDate: Date | undefined = undefined
	public readonly additionalServices: { id: string; name: string; price: number; }[] = []
	public specialRequest: string | undefined

	public create(
		id: string,
		houseId: string,
		startDate: Date,
		endDate: Date,
		price: number
	): void {
		this.applyChange(new ReservationCreated(id, houseId, startDate, endDate, price))
	}
	private applyReservationCreated(event: ReservationCreated): void
	{
		this.id = event.aggregateId
		this.houseId = event.houseId
		this.startDate = event.startDate
		this.endDate = event.endDate
		this.price = event.price
	}

	public setOccupancy(numberOfGuests: number): void
	{
		this.applyChange(new OccupancySet(this.id, numberOfGuests))
	}
	private applyOccupancySet(event: OccupancySet): void
	{
		this.numberOfGuests = event.numberOfGuests
	}

	public addAdditionalService(serviceId: string, name: string, price: number): void
	{
		if (this.additionalServices.some(service => service.id === serviceId))
		{
			throw new Error('The additional service has already been added')
		}
		this.applyChange(new AdditionalServiceAdded(this.id, serviceId, name, price))
	}
	private applyAdditionalServiceAdded(event: AdditionalServiceAdded): void
	{
		this.additionalServices.push({ id: event.serviceId, name: event.name, price: event.price })
	}

	public removeAdditionalService(serviceId: string): void
	{
		this.applyChange(new AdditionalServiceRemoved(this.id, serviceId))
	}
	private applyAdditionalServiceRemoved(event: AdditionalServiceRemoved): void
	{
		const index = this.additionalServices.findIndex(service => service.id === event.serviceId)
		if (index !== -1)
		{
			this.additionalServices.splice(index, 1)
		}
	}

	public setSpecialRequest(message: string): void
	{
		this.applyChange(new SpecialRequestSet(this.id, message))
	}
	private applySpecialRequestSet(event: SpecialRequestSet): void
	{
		this.specialRequest = event.message
	}
}
