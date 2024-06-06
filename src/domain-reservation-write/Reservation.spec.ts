import { Reservation } from './Reservation.js'

describe('Reservation', () => {
	let reservation: Reservation

	beforeEach(() => {
		reservation = new Reservation()
		reservation.create('1', 'house1', new Date(), new Date(), 100)
	})

	it('should update the number of guests', () => {
		// Arrange
		const newNumberOfGuests = 2

		// Act
		reservation.setOccupancy(newNumberOfGuests)

		// Assert
		expect(reservation.numberOfGuests).toEqual(newNumberOfGuests)
		expect(reservation.getVersion()).toEqual(2)
		expect(reservation.getUncommittedChanges()).toHaveLength(2)
	})

	it('should set a special request', () => {
		// Arrange
		const specialRequest = 'Need extra towels'

		// Act
		reservation.setSpecialRequest(specialRequest)

		// Assert
		expect(reservation.specialRequest).toEqual(specialRequest)
		expect(reservation.getVersion()).toEqual(2)
		expect(reservation.getUncommittedChanges()).toHaveLength(2)
	})

	it('should add an additional service', () => {
		// Arrange
		const serviceId = 'breakfast-1'
		const serviceDescription = 'Breakfast'
		const servicePrice = 10

		// Act
		reservation.addAdditionalService(serviceId, serviceDescription, servicePrice)

		// Assert
		expect(reservation.additionalServices).toContainEqual({
			id: serviceId, description: serviceDescription, price: servicePrice
		})
		expect(reservation.getVersion()).toEqual(2)
		expect(reservation.getUncommittedChanges()).toHaveLength(2)
	})

	it('should remove an additional service', () => {
		// Arrange
		const serviceId = 'breakfast-1'
		const serviceDescription = 'Breakfast'
		const servicePrice = 10
		reservation.addAdditionalService(serviceId, serviceDescription, servicePrice)

		// Act
		reservation.removeAdditionalService(serviceId)

		// Assert
		expect(reservation.additionalServices).not.toContainEqual({
			id: serviceId, description: serviceDescription, price: servicePrice
		})
		expect(reservation.getVersion()).toEqual(3)
		expect(reservation.getUncommittedChanges()).toHaveLength(3)
	})
})