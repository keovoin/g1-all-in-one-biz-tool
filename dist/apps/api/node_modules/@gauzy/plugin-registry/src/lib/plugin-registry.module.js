"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginRegistryModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const application_1 = require("./application");
const domain_1 = require("./domain");
const handlers_1 = require("./domain/events/handlers");
const infrastructure_1 = require("./infrastructure");
let PluginRegistryModule = class PluginRegistryModule {
};
exports.PluginRegistryModule = PluginRegistryModule;
exports.PluginRegistryModule = PluginRegistryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([...domain_1.entities]),
            nestjs_1.MikroOrmModule.forFeature([...domain_1.entities]),
            core_1.UserModule,
            core_1.RolePermissionModule,
            core_1.RoleModule,
            core_1.TagModule,
            cqrs_1.CqrsModule
        ],
        providers: [...domain_1.services, ...application_1.handlers, ...domain_1.repositories, ...infrastructure_1.subscribers, ...handlers_1.eventHandlers, ...domain_1.factories],
        controllers: infrastructure_1.controllers
    })
], PluginRegistryModule);
//# sourceMappingURL=plugin-registry.module.js.map