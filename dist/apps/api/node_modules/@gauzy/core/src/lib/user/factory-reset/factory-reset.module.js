"use strict";
// Modified code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryResetModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const plugin_1 = require("@gauzy/plugin");
const config_1 = require("@gauzy/config");
const factory_reset_service_1 = require("./factory-reset.service");
const entities_1 = require("../../core/entities");
let FactoryResetModule = class FactoryResetModule {
};
exports.FactoryResetModule = FactoryResetModule;
exports.FactoryResetModule = FactoryResetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ...entities_1.coreEntities,
                ...(0, plugin_1.getEntitiesFromPlugins)((0, config_1.getConfig)().plugins)
            ]),
            nestjs_1.MikroOrmModule.forFeature([
                ...entities_1.coreEntities,
                ...(0, plugin_1.getEntitiesFromPlugins)((0, config_1.getConfig)().plugins)
            ]),
        ],
        providers: [
            factory_reset_service_1.FactoryResetService,
        ],
        exports: [
            factory_reset_service_1.FactoryResetService
        ]
    })
], FactoryResetModule);
//# sourceMappingURL=factory-reset.module.js.map