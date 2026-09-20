"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const utils_1 = require("@gauzy/utils");
let EventBus = class EventBus {
    constructor() {
        this.event$ = new rxjs_1.Subject();
        this.onDestroy$ = new rxjs_1.Subject();
    }
    /**
     * Publishes a single event.
     * @param event The event to be published.
     */
    async publish(event) {
        this.event$.next(event);
    }
    /**
     * Publishes multiple events in sequence.
     * @param events The events to be published.
     */
    async publishMultiple(events) {
        for await (const event of events) {
            this.event$.next(event);
        }
    }
    /**
     * Subscribes to events of the given type.
     * @param event The type of events to subscribe to.
     * @returns An Observable of events with the specified type.
     */
    ofType(event) {
        return this.event$.asObservable().pipe((0, rxjs_1.takeUntil)(this.onDestroy$), // Unsubscribe when the component is destroyed
        (0, rxjs_1.filter)((item) => item.constructor === event), //
        (0, rxjs_1.filter)(utils_1.isNotNullOrUndefined) //
        );
    }
    /**
     * Lifecycle hook method executed when a module is being destroyed.
     * It completes the onDestroy$ subject to ensure proper cleanup.
     */
    onModuleDestroy() {
        /**
         * Sends a completion signal to the onDestroy$ subject.
         * This is typically used to signal cleanup or completion of asynchronous tasks.
         */
        this.onDestroy$.next();
        /**
         * Completes the onDestroy$ subject, marking it as finished.
         * After completion, the subject will not emit any more values.
         */
        this.onDestroy$.complete();
    }
};
exports.EventBus = EventBus;
exports.EventBus = EventBus = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], EventBus);
//# sourceMappingURL=event-bus.js.map