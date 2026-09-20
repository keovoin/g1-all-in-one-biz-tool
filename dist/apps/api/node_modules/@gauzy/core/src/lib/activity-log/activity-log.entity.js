"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const pipes_1 = require("../shared/pipes");
const mikro_orm_activity_log_repository_1 = require("./repository/mikro-orm-activity-log.repository");
let ActivityLog = class ActivityLog extends internal_1.BasePerEntityType {
};
exports.ActivityLog = ActivityLog;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.ActionTypeEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActionTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.ActorTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActorTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'int', nullable: true, transformer: new pipes_1.ActorTypeTransformer() }),
    tslib_1.__metadata("design:type", String)
], ActivityLog.prototype, "actorType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], ActivityLog.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Array)
], ActivityLog.prototype, "updatedFields", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Array)
], ActivityLog.prototype, "previousValues", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Array)
], ActivityLog.prototype, "updatedValues", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Array)
], ActivityLog.prototype, "previousEntities", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Array)
], ActivityLog.prototype, "updatedEntities", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], ActivityLog.prototype, "data", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ActivityLog.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], ActivityLog.prototype, "employeeId", void 0);
exports.ActivityLog = ActivityLog = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('activity_log', { mikroOrmRepository: () => mikro_orm_activity_log_repository_1.MikroOrmActivityLogRepository })
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map