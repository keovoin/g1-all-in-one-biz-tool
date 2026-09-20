"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalPolicy = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_approval_policy_repository_1 = require("./repository/mikro-orm-approval-policy.repository");
let ApprovalPolicy = class ApprovalPolicy extends internal_1.TenantOrganizationBaseEntity {
};
exports.ApprovalPolicy = ApprovalPolicy;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ApprovalPolicy.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ApprovalPolicy.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ApprovalPolicy.prototype, "approvalType", void 0);
exports.ApprovalPolicy = ApprovalPolicy = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('approval_policy', { mikroOrmRepository: () => mikro_orm_approval_policy_repository_1.MikroOrmApprovalPolicyRepository })
], ApprovalPolicy);
//# sourceMappingURL=approval-policy.entity.js.map