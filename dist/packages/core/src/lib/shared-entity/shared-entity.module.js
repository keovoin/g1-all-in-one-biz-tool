"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedEntityModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const shared_entity_entity_1 = require("./shared-entity.entity");
const shared_entity_service_1 = require("./shared-entity.service");
const shared_entity_controller_1 = require("./shared-entity.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_shared_entity_repository_1 = require("./repository/type-orm-shared-entity.repository");
const mikro_orm_shared_entity_repository_1 = require("./repository/mikro-orm-shared-entity.repository");
let SharedEntityModule = class SharedEntityModule {
};
exports.SharedEntityModule = SharedEntityModule;
exports.SharedEntityModule = SharedEntityModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([shared_entity_entity_1.SharedEntity]),
            nestjs_1.MikroOrmModule.forFeature([shared_entity_entity_1.SharedEntity]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [shared_entity_controller_1.SharedEntityController],
        providers: [shared_entity_service_1.SharedEntityService, type_orm_shared_entity_repository_1.TypeOrmSharedEntityRepository, mikro_orm_shared_entity_repository_1.MikroOrmSharedEntityRepository, ...handlers_1.CommandHandlers]
    })
], SharedEntityModule);
//# sourceMappingURL=shared-entity.module.js.map