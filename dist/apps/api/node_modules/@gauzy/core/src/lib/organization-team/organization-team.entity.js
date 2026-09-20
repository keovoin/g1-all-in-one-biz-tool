"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeam = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_team_repository_1 = require("./repository/mikro-orm-organization-team.repository");
let OrganizationTeam = class OrganizationTeam extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationTeam = OrganizationTeam;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "emoji", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "teamSize", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "logo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "prefix", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationTeam.prototype, "shareProfileView", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationTeam.prototype, "requirePlanToTrack", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationTeam.prototype, "public", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "profile_link", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ImageAsset, {
        nullable: true, // Indicates that the relation is optional (i.e. the value may be null)
        onDelete: 'SET NULL', // If the referenced ImageAsset is deleted, set this foreign key to NULL.
        eager: true // The related ImageAsset is eagerly loaded, meaning it is automatically fetched with the OrganizationTeam entity.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationTeam.prototype, "image", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.image),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationTeam.prototype, "imageId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationTeamEmployee, (it) => it.organizationTeam, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "members", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.RequestApprovalTeam, (it) => it.team),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "requestApprovals", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Goal, (it) => it.ownerTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "goals", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskStatus, (status) => status.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "statuses", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskRelatedIssueType, (it) => it.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "relatedIssueTypes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskPriority, (it) => it.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "priorities", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskSize, (it) => it.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "sizes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskVersion, (it) => it.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "versions", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskView, (it) => it.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "views", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Tag, (it) => it.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "labels", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.IssueType, (it) => it.organizationTeam),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "issueTypes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.DailyPlan, (dailyPlan) => dailyPlan.organizationTeam, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "dailyPlans", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (it) => it.organizationTeams, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_organization_team',
        joinColumn: 'organizationTeamId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_organization_team'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Task, (it) => it.teams, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "tasks", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationProjectModule, (it) => it.teams, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "modules", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.EquipmentSharing, (it) => it.teams, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "equipmentSharings", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationProject, (it) => it.teams, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "projects", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Comment, (it) => it.teams, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationTeam.prototype, "assignedComments", void 0);
exports.OrganizationTeam = OrganizationTeam = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_team', { mikroOrmRepository: () => mikro_orm_organization_team_repository_1.MikroOrmOrganizationTeamRepository })
], OrganizationTeam);
//# sourceMappingURL=organization-team.entity.js.map