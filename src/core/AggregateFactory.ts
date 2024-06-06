import type { IEvent, } from './message-bus/Event.js'

interface IAggregateFactory<T> {

	create(...args: any[]): T

	loadFromHistory(history: IEvent[]): T
}
export type { IAggregateFactory, }
