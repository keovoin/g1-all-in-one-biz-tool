"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationVendorModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const organization_vendor_entity_1 = require("./organization-vendor.entity");
const organization_vendor_controller_1 = require("./organization-vendor.controller");
const organization_vendor_service_1 = require("./organization-vendor.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_organization_vendor_repository_1 = require("./repository/type-orm-organization-vendor.repository");
const mikro_orm_organization_vendor_repository_1 = require("./repository/mikro-orm-organization-vendor.repository");
let OrganizationVendorModule = class OrganizationVendorModule {
};
exports.OrganizationVendorModule = OrganizationVendorModule;
exports.OrganizationVendorModule = OrganizationVendorModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_vendor_entity_1.OrganizationVendor]),
            nestjs_1.MikroOrmModule.forFeature([organization_vendor_entity_1.OrganizationVendor]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [organization_vendor_controller_1.OrganizationVendorController],
        providers: [organization_vendor_service_1.OrganizationVendorService, type_orm_organization_vendor_repository_1.TypeOrmOrganizationVendorRepository, mikro_orm_organization_vendor_repository_1.MikroOrmOrganizationVendorRepository, ...handlers_1.CommandHandlers],
        exports: [organization_vendor_service_1.OrganizationVendorService]
    })
], OrganizationVendorModule);
//# sourceMappingURL=organization-vendor.module.js.map