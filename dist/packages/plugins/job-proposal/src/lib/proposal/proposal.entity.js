"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proposal = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const mikro_orm_proposal_repository_1 = require("./repository/mikro-orm-proposal.repository");
let Proposal = class Proposal extends core_1.TenantOrganizationBaseEntity {
};
exports.Proposal = Proposal;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Proposal.prototype, "jobPostUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Proposal.prototype, "valueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Proposal.prototype, "jobPostContent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Proposal.prototype, "proposalContent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.ProposalStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.ProposalStatusEnum),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Proposal.prototype, "status", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Proposal.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Proposal.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.OrganizationContact, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Proposal.prototype, "organizationContact", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationContact),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Proposal.prototype, "organizationContactId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToMany)(() => core_1.Tag, {
        /**  Database cascade action on update. */
        onUpdate: 'CASCADE',
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true,
        /** Pivot table for many-to-many relationship. */
        pivotTable: 'tag_proposal',
        /** Column in pivot table referencing 'proposal' primary key. */
        joinColumn: 'proposalId',
        /** Column in pivot table referencing 'tag' primary key. */
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'tag_proposal' }),
    tslib_1.__metadata("design:type", Array)
], Proposal.prototype, "tags", void 0);
exports.Proposal = Proposal = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('proposal', { mikroOrmRepository: () => mikro_orm_proposal_repository_1.MikroOrmProposalRepository })
], Proposal);
//# sourceMappingURL=proposal.entity.js.map