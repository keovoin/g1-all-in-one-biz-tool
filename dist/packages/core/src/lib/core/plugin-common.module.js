"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCommonModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const event_bus_module_1 = require("../event-bus/event-bus.module");
let PluginCommonModule = class PluginCommonModule {
};
exports.PluginCommonModule = PluginCommonModule;
exports.PluginCommonModule = PluginCommonModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [event_bus_module_1.EventBusModule],
        exports: [event_bus_module_1.EventBusModule]
    })
], PluginCommonModule);
//# sourceMappingURL=plugin-common.module.js.map