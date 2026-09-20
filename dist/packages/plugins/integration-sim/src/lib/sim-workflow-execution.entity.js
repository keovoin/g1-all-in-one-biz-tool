"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimWorkflowExecution = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const mikro_orm_sim_workflow_execution_repository_1 = require("./repository/mikro-orm-sim-workflow-execution.repository");
let SimWorkflowExecution = class SimWorkflowExecution extends core_1.TenantOrganizationBaseEntity {
};
exports.SimWorkflowExecution = SimWorkflowExecution;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], SimWorkflowExecution.prototype, "workflowId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], SimWorkflowExecution.prototype, "executionId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], SimWorkflowExecution.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: 'json', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], SimWorkflowExecution.prototype, "input", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: 'json', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], SimWorkflowExecution.prototype, "output", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: 'json', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], SimWorkflowExecution.prototype, "error", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], SimWorkflowExecution.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], SimWorkflowExecution.prototype, "triggeredBy", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.IntegrationTenant, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], SimWorkflowExecution.prototype, "integration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.integration),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], SimWorkflowExecution.prototype, "integrationId", void 0);
exports.SimWorkflowExecution = SimWorkflowExecution = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('integration_sim_workflow_execution', {
        mikroOrmRepository: () => mikro_orm_sim_workflow_execution_repository_1.MikroOrmSimWorkflowExecutionRepository
    })
], SimWorkflowExecution);
//# sourceMappingURL=sim-workflow-execution.entity.js.map