"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const role_entity_1 = require("./role.entity");
let RoleSubscriber = class RoleSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Role events.
     */
    listenTo() {
        return role_entity_1.Role;
    }
};
exports.RoleSubscriber = RoleSubscriber;
exports.RoleSubscriber = RoleSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], RoleSubscriber);
//# sourceMappingURL=role.subscriber.js.map