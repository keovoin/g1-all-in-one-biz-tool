"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskVersion = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../../core/entities/internal");
const entity_1 = require("../../core/decorators/entity");
const mikro_orm_task_version_repository_1 = require("./repository/mikro-orm-task-version.repository");
let TaskVersion = class TaskVersion extends internal_1.TenantOrganizationBaseEntity {
};
exports.TaskVersion = TaskVersion;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TaskVersion.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TaskVersion.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskVersion.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskVersion.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskVersion.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, entity_1.MultiORMColumn)({ default: false, update: false }),
    tslib_1.__metadata("design:type", Boolean)
], TaskVersion.prototype, "isSystem", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], TaskVersion.prototype, "fullIconUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, (it) => it.versions, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], TaskVersion.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.project),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], TaskVersion.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationTeam, (it) => it.versions, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], TaskVersion.prototype, "organizationTeam", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationTeam),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], TaskVersion.prototype, "organizationTeamId", void 0);
exports.TaskVersion = TaskVersion = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('task_version', { mikroOrmRepository: () => mikro_orm_task_version_repository_1.MikroOrmTaskVersionRepository })
], TaskVersion);
//# sourceMappingURL=version.entity.js.map