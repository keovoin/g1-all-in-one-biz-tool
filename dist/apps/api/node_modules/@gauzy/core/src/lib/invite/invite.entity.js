"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invite = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_invite_repository_1 = require("./repository/mikro-orm-invite.repository");
const export_redact_decorator_1 = require("../export-import/export-redact.decorator");
let Invite = class Invite extends internal_1.TenantOrganizationBaseEntity {
};
exports.Invite = Invite;
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "token", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsEmail)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.InviteStatusEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.InviteStatusEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Invite.prototype, "expireDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Invite.prototype, "actionDate", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "code", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], Invite.prototype, "isExpired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Role }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Role, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'CASCADE' // Defines the database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Invite.prototype, "role", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((invite) => invite.role),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, (it) => it.invites, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'SET NULL' // Defines the database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Invite.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((invite) => invite.user),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'CASCADE' // Defines the database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Invite.prototype, "invitedByUser", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((invite) => invite.invitedByUser),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Invite.prototype, "invitedByUserId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationProject, {
        owner: true, // Indicates if the relation column value is the owner of the relation.
        pivotTable: 'invite_organization_project', // Defines the pivot table name.
        joinColumn: 'inviteId', // Defines the join column name.
        inverseJoinColumn: 'organizationProjectId' // Defines the inverse join column name.
    }),
    (0, typeorm_1.JoinTable)({ name: 'invite_organization_project' }),
    tslib_1.__metadata("design:type", Array)
], Invite.prototype, "projects", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationContact, {
        owner: true, // Indicates if the relation column value is the owner of the relation.
        pivotTable: 'invite_organization_contact', // Defines the pivot table name.
        joinColumn: 'inviteId', // Defines the join column name.
        inverseJoinColumn: 'organizationContactId' // Defines the inverse join column name.
    }),
    (0, typeorm_1.JoinTable)({ name: 'invite_organization_contact' }),
    tslib_1.__metadata("design:type", Array)
], Invite.prototype, "organizationContacts", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationDepartment, {
        owner: true, // Indicates if the relation column value is the owner of the relation.
        pivotTable: 'invite_organization_department', // Defines the pivot table name.
        joinColumn: 'inviteId', // Defines the join column name.
        inverseJoinColumn: 'organizationDepartmentId' // Defines the inverse join column name.
    }),
    (0, typeorm_1.JoinTable)({ name: 'invite_organization_department' }),
    tslib_1.__metadata("design:type", Array)
], Invite.prototype, "departments", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationTeam, {
        owner: true, // Indicates if the relation column value is the owner of the relation.
        pivotTable: 'invite_organization_team', // Defines the pivot table name.
        joinColumn: 'inviteId', // Defines the join column name.
        inverseJoinColumn: 'organizationTeamId' // Defines the inverse join column name.
    }),
    (0, typeorm_1.JoinTable)({ name: 'invite_organization_team' }),
    tslib_1.__metadata("design:type", Array)
], Invite.prototype, "teams", void 0);
exports.Invite = Invite = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('invite', { mikroOrmRepository: () => mikro_orm_invite_repository_1.MikroOrmInviteRepository })
], Invite);
//# sourceMappingURL=invite.entity.js.map