"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApproval = void 0;
const tslib_1 = require("tslib");
/*
  - Request Approval is a request which is made by the employee. The employee can ask the approver for approvals different things.
  E.g. business trips, job referral awards, etc.
  - Request Approval table has the many to one relationship to ApprovalPolicy table by approvalPolicyId
  - Request Approval table has the one to many relationships to RequestApprovalEmployee table
  - Request Approval table has the many to many relationships to the Employee table through the RequestApprovalEmployee table.
*/
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_request_approval_repository_1 = require("./repository/mikro-orm-request-approval.repository");
let RequestApproval = class RequestApproval extends internal_1.TenantOrganizationBaseEntity {
};
exports.RequestApproval = RequestApproval;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], RequestApproval.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestApproval.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestApproval.prototype, "min_count", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RequestApproval.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ApprovalPolicyTypesStringEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ApprovalPolicyTypesStringEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RequestApproval.prototype, "requestType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.ApprovalPolicy }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ApprovalPolicy, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], RequestApproval.prototype, "approvalPolicy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.approvalPolicy),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], RequestApproval.prototype, "approvalPolicyId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.RequestApprovalEmployee, (it) => it.requestApproval, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], RequestApproval.prototype, "employeeApprovals", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.RequestApprovalTeam, (it) => it.requestApproval, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], RequestApproval.prototype, "teamApprovals", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (it) => it.requestApprovals, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_request_approval',
        joinColumn: 'requestApprovalId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'tag_request_approval' }),
    tslib_1.__metadata("design:type", Array)
], RequestApproval.prototype, "tags", void 0);
exports.RequestApproval = RequestApproval = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('request_approval', { mikroOrmRepository: () => mikro_orm_request_approval_repository_1.MikroOrmRequestApprovalRepository })
], RequestApproval);
//# sourceMappingURL=request-approval.entity.js.map