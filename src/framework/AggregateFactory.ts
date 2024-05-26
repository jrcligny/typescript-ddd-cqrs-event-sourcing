/* c8 ignore next 13 */
/* Ignore coverage for this file */

import type { IEvent, } from './Event.js'

interface IAggregateFactory<T> {

	create(...args: any[]): T

	loadFromHistory(history: IEvent[]): T
}
export type { IAggregateFactory, }
