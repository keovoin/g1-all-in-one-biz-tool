"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const merchant_entity_1 = require("./merchant.entity");
const merchant_controller_1 = require("./merchant.controller");
const merchant_service_1 = require("./merchant.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
let MerchantModule = class MerchantModule {
};
exports.MerchantModule = MerchantModule;
exports.MerchantModule = MerchantModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([merchant_entity_1.Merchant]), nestjs_1.MikroOrmModule.forFeature([merchant_entity_1.Merchant]), role_permission_module_1.RolePermissionModule],
        controllers: [merchant_controller_1.MerchantController],
        providers: [merchant_service_1.MerchantService],
        exports: [merchant_service_1.MerchantService]
    })
], MerchantModule);
//# sourceMappingURL=merchant.module.js.map