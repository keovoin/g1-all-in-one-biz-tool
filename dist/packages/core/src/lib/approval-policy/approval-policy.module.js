"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalPolicyModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const approval_policy_entity_1 = require("./approval-policy.entity");
const approval_policy_controller_1 = require("./approval-policy.controller");
const approval_policy_service_1 = require("./approval-policy.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_approval_policy_repository_1 = require("./repository/type-orm-approval-policy.repository");
const mikro_orm_approval_policy_repository_1 = require("./repository/mikro-orm-approval-policy.repository");
let ApprovalPolicyModule = class ApprovalPolicyModule {
};
exports.ApprovalPolicyModule = ApprovalPolicyModule;
exports.ApprovalPolicyModule = ApprovalPolicyModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([approval_policy_entity_1.ApprovalPolicy]),
            nestjs_1.MikroOrmModule.forFeature([approval_policy_entity_1.ApprovalPolicy]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [approval_policy_controller_1.ApprovalPolicyController],
        providers: [approval_policy_service_1.ApprovalPolicyService, type_orm_approval_policy_repository_1.TypeOrmApprovalPolicyRepository, mikro_orm_approval_policy_repository_1.MikroOrmApprovalPolicyRepository, ...handlers_1.CommandHandlers],
        exports: [approval_policy_service_1.ApprovalPolicyService]
    })
], ApprovalPolicyModule);
//# sourceMappingURL=approval-policy.module.js.map