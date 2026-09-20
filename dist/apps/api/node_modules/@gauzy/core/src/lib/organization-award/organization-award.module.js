"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationAwardModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_award_entity_1 = require("./organization-award.entity");
const organization_award_controller_1 = require("./organization-award.controller");
const organization_award_service_1 = require("./organization-award.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_organization_award_repository_1 = require("./repository/type-orm-organization-award.repository");
const mikro_orm_organization_award_repository_1 = require("./repository/mikro-orm-organization-award.repository");
let OrganizationAwardModule = class OrganizationAwardModule {
};
exports.OrganizationAwardModule = OrganizationAwardModule;
exports.OrganizationAwardModule = OrganizationAwardModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_award_entity_1.OrganizationAward]),
            nestjs_1.MikroOrmModule.forFeature([organization_award_entity_1.OrganizationAward]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [organization_award_controller_1.OrganizationAwardController],
        providers: [organization_award_service_1.OrganizationAwardService, type_orm_organization_award_repository_1.TypeOrmOrganizationAwardRepository, mikro_orm_organization_award_repository_1.MikroOrmOrganizationAwardRepository]
    })
], OrganizationAwardModule);
//# sourceMappingURL=organization-award.module.js.map