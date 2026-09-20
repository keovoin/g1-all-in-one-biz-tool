"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const event_bus_1 = require("./event-bus");
const handlers_1 = require("./events/handlers");
let EventBusModule = class EventBusModule {
};
exports.EventBusModule = EventBusModule;
exports.EventBusModule = EventBusModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [event_bus_1.EventBus, ...handlers_1.EventHandlers],
        exports: [event_bus_1.EventBus]
    })
], EventBusModule);
//# sourceMappingURL=event-bus.module.js.map