"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const config_1 = require("@gauzy/config");
const plugin_1 = require("@gauzy/plugin");
const import_controller_1 = require("./import.controller");
const import_service_1 = require("./import.service");
const entities_1 = require("../../core/entities");
const handlers_1 = require("./commands/handlers");
const import_record_1 = require("../import-record");
const import_history_1 = require("../import-history");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const user_module_1 = require("../../user/user.module");
const repositories_service_1 = require("../repositories/repositories.service");
let ImportModule = class ImportModule {
};
exports.ImportModule = ImportModule;
exports.ImportModule = ImportModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([...entities_1.coreEntities, ...(0, plugin_1.getEntitiesFromPlugins)((0, config_1.getConfig)().plugins)]),
            nestjs_1.MikroOrmModule.forFeature([...entities_1.coreEntities, ...(0, plugin_1.getEntitiesFromPlugins)((0, config_1.getConfig)().plugins)]),
            role_permission_module_1.RolePermissionModule,
            user_module_1.UserModule,
            import_record_1.ImportRecordModule,
            import_history_1.ImportHistoryModule,
            cqrs_1.CqrsModule
        ],
        controllers: [import_controller_1.ImportController],
        providers: [import_service_1.ImportService, repositories_service_1.RepositoriesService, ...handlers_1.CommandHandlers]
    })
], ImportModule);
//# sourceMappingURL=import.module.js.map