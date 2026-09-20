"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const keyresult_entity_1 = require("./keyresult.entity");
const keyresult_service_1 = require("./keyresult.service");
const keyresult_controller_1 = require("./keyresult.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_keyresult_repository_1 = require("./repository/type-orm-keyresult.repository");
const mikro_orm_keyresult_repository_1 = require("./repository/mikro-orm-keyresult.repository");
let KeyResultModule = class KeyResultModule {
};
exports.KeyResultModule = KeyResultModule;
exports.KeyResultModule = KeyResultModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([keyresult_entity_1.KeyResult]),
            nestjs_1.MikroOrmModule.forFeature([keyresult_entity_1.KeyResult]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [keyresult_controller_1.KeyResultController],
        providers: [keyresult_service_1.KeyResultService, type_orm_keyresult_repository_1.TypeOrmKeyResultRepository, mikro_orm_keyresult_repository_1.MikroOrmKeyResultRepository]
    })
], KeyResultModule);
//# sourceMappingURL=keyresult.module.js.map