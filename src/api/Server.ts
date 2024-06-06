import express from 'express';
import bodyParser from 'body-parser';
// core
import { JSONFileEventStore, } from '../core/event-store/JSONFileEventStore.js'
import { EventBus, } from '../core/message-bus/EventBus.js'
// api
import { instantiate as instantiateQueryReservationController, } from './ReservationReadController.js'
import { instanciate as instantiateCommandReservationController, } from './ReservationWriteController.js'

const app = express()
app.use(bodyParser.json())

const eventBus = new EventBus()
const eventStore = new JSONFileEventStore(eventBus, './out/data/')

instantiateCommandReservationController(eventStore, app)
instantiateQueryReservationController(eventBus, app)

const port = 3000
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
