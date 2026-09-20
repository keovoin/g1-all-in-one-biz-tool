"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const payment_entity_1 = require("./payment.entity");
let PaymentSubscriber = class PaymentSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Payment events.
     */
    listenTo() {
        return payment_entity_1.Payment;
    }
};
exports.PaymentSubscriber = PaymentSubscriber;
exports.PaymentSubscriber = PaymentSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], PaymentSubscriber);
//# sourceMappingURL=payment.subscriber.js.map