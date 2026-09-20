"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportHistoryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const import_history_entity_1 = require("./import-history.entity");
const import_history_service_1 = require("./import-history.service");
const import_history_controller_1 = require("./import-history.controller");
const type_orm_import_history_repository_1 = require("./repository/type-orm-import-history.repository");
const mikro_orm_import_history_repository_1 = require("./repository/mikro-orm-import-history.repository");
let ImportHistoryModule = class ImportHistoryModule {
};
exports.ImportHistoryModule = ImportHistoryModule;
exports.ImportHistoryModule = ImportHistoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([import_history_entity_1.ImportHistory]),
            nestjs_1.MikroOrmModule.forFeature([import_history_entity_1.ImportHistory]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [import_history_controller_1.ImportHistoryController],
        providers: [import_history_service_1.ImportHistoryService, type_orm_import_history_repository_1.TypeOrmImportHistoryRepository, mikro_orm_import_history_repository_1.MikroOrmImportHistoryRepository, ...handlers_1.CommandHandlers]
    })
], ImportHistoryModule);
//# sourceMappingURL=import-history.module.js.map