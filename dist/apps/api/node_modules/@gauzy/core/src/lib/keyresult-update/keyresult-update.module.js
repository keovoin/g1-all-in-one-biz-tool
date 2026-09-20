"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultUpdateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const keyresult_update_service_1 = require("./keyresult-update.service");
const keyresult_update_controller_1 = require("./keyresult-update.controller");
const keyresult_update_entity_1 = require("./keyresult-update.entity");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_keyresult_update_repository_1 = require("./repository/type-orm-keyresult-update.repository");
const mikro_orm_keyresult_update_repository_1 = require("./repository/mikro-orm-keyresult-update.repository");
let KeyResultUpdateModule = class KeyResultUpdateModule {
};
exports.KeyResultUpdateModule = KeyResultUpdateModule;
exports.KeyResultUpdateModule = KeyResultUpdateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([keyresult_update_entity_1.KeyResultUpdate]),
            nestjs_1.MikroOrmModule.forFeature([keyresult_update_entity_1.KeyResultUpdate]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [keyresult_update_controller_1.KeyResultUpdateController],
        providers: [keyresult_update_service_1.KeyResultUpdateService, type_orm_keyresult_update_repository_1.TypeOrmKeyResultUpdateRepository, mikro_orm_keyresult_update_repository_1.MikroOrmKeyResultUpdateRepository, ...handlers_1.CommandHandlers]
    })
], KeyResultUpdateModule);
//# sourceMappingURL=keyresult-update.module.js.map