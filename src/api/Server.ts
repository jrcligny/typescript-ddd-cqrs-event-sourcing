import express from 'express';
import bodyParser from 'body-parser';
// framework
import { EventStore, } from '../framework/EventStore.js'
import { EventBus, } from '../framework/EventBus.js'
// api
import { instantiate as instantiateQueryReservationController, } from './ReservationReadController.js'
import { instanciate as instantiateCommandReservationController, } from './ReservationWriteController.js'

const app = express()
app.use(bodyParser.json())

const eventBus = new EventBus()
const eventStore = new EventStore(eventBus)

instantiateCommandReservationController(eventStore, app)
instantiateQueryReservationController(eventBus, app)

const port = 3000
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
