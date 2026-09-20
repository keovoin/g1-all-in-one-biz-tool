"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const plugin_1 = require("@gauzy/plugin");
const config_1 = require("@gauzy/config");
const entities_1 = require("../../core/entities");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const export_controller_1 = require("./export.controller");
const export_service_1 = require("./export.service");
const repositories_service_1 = require("../repositories/repositories.service");
let ExportModule = class ExportModule {
};
exports.ExportModule = ExportModule;
exports.ExportModule = ExportModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([...entities_1.coreEntities, ...(0, plugin_1.getEntitiesFromPlugins)((0, config_1.getConfig)().plugins)]),
            nestjs_1.MikroOrmModule.forFeature([...entities_1.coreEntities, ...(0, plugin_1.getEntitiesFromPlugins)((0, config_1.getConfig)().plugins)]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [export_controller_1.ExportController],
        providers: [export_service_1.ExportService, repositories_service_1.RepositoriesService]
    })
], ExportModule);
//# sourceMappingURL=export.module.js.map