"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationPositionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_position_entity_1 = require("./organization-position.entity");
const organization_position_controller_1 = require("./organization-position.controller");
const organization_position_service_1 = require("./organization-position.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_organization_position_repository_1 = require("./repository/type-orm-organization-position.repository");
const mikro_orm_organization_position_repository_1 = require("./repository/mikro-orm-organization-position.repository");
let OrganizationPositionModule = class OrganizationPositionModule {
};
exports.OrganizationPositionModule = OrganizationPositionModule;
exports.OrganizationPositionModule = OrganizationPositionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_position_entity_1.OrganizationPosition]),
            nestjs_1.MikroOrmModule.forFeature([organization_position_entity_1.OrganizationPosition]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [organization_position_controller_1.OrganizationPositionController],
        providers: [organization_position_service_1.OrganizationPositionService, type_orm_organization_position_repository_1.TypeOrmOrganizationPositionRepository, mikro_orm_organization_position_repository_1.MikroOrmOrganizationPositionRepository]
    })
], OrganizationPositionModule);
//# sourceMappingURL=organization-position.module.js.map