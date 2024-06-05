import { ReservationFactory, } from './ReservationFactory.js'
import { OccupancySet, } from './events/OccupancySet.js'
import { ReservationCreated, } from './events/ReservationCreated.js'

describe('ReservationFactory', () => {
	let factory: ReservationFactory

	beforeEach(() => {
		factory = new ReservationFactory()
	})

	it('should create a reservation', () => {
		// Arrange
		const id = '1'
		const houseId = 'house1'
		const arrivalDate = new Date()
		const departureDate = new Date()
		const price = 100

		// Act
		const reservation = factory.create(id, houseId, arrivalDate, departureDate, price)

		// Assert
		expect(reservation.getId()).toEqual(id)
		expect(reservation.houseId).toEqual(houseId)
		expect(reservation.arrivalDate).toEqual(arrivalDate)
		expect(reservation.departureDate).toEqual(departureDate)
		expect(reservation.price).toEqual(price)

		expect(reservation.getVersion()).toEqual(1)
		expect(reservation.getUncommittedChanges()).toHaveLength(1)
	})

	it('should load a reservation from history', () => {
		// Arrange
		const history = [
			new ReservationCreated('1', 'house1', new Date(), new Date(), 100),
			new OccupancySet('1', 2)
		]

		// Act
		const reservation = factory.loadFromHistory(history)

		// Assert
		expect(reservation.getId()).toEqual('1')
		expect(reservation.houseId).toEqual('house1')
		expect(reservation.price).toEqual(100)
		expect(reservation.numberOfGuests).toEqual(2)

		expect(reservation.getVersion()).toEqual(2)
		expect(reservation.getUncommittedChanges()).toHaveLength(0)
	})
})