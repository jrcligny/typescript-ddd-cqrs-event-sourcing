# @jrcligny/typescript-ddd-cqrs-event-sourcing

This is a TypeScript project that provides a framework for implementing Domain-Driven Design (DDD) with Command Query Responsibility Segregation (CQRS) and Event Sourcing.

It is a work in progress and is not yet ready for production use (see [Roadmap](#roadmap)).

It is inspired by [xolvio/typescript-event-sourcing](https://github.com/xolvio/typescript-event-sourcing).

## Wiki

This project has a [wiki](https://github.com/jrcligny/typescript-ddd-cqrs-event-sourcing/wiki) to gather information about DDD, CQRS, and Event Sourcing and provide explanations on how this project implements these concepts.

## Roadmap

- [x] Implement write model framework
	- [x] Implement command
	- [x] Implement command bus
	- [x] Implement aggregate
	- [x] Implement event
	- [x] Implement event bus
	- [x] Implement event store
	- [x] Implement repository

- [ ] Implement read model framework
	- [ ] Implement query
	- [ ] Implement query bus
	- [ ] Implement read model
	- [ ] Implement projection

## Changelog

All notable changes to this project are documented in [CHANGELOG.md](./CHANGELOG.md).

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## License

Distributed under the MIT License. See [LICENSE.md](./LICENSE.md) for more information.

## Credits

- [xolvio/typescript-event-sourcing](https://github.com/xolvio/typescript-event-sourcing)
