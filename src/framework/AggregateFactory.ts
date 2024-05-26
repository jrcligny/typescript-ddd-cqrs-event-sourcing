import type { IEvent, } from './Event.js'

interface IAggregateFactory<T> {

	create(...args: any[]): T

	loadFromHistory(history: IEvent[]): T
}
export type { IAggregateFactory, }
