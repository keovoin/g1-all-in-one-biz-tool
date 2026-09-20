"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHistory = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_email_history_repository_1 = require("./repository/mikro-orm-email-history.repository");
let EmailHistory = class EmailHistory extends internal_1.TenantOrganizationBaseEntity {
};
exports.EmailHistory = EmailHistory;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmailHistory.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, ...((0, config_1.isMySQL)() ? { type: 'text' } : {}) }),
    tslib_1.__metadata("design:type", String)
], EmailHistory.prototype, "content", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsEmail)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmailHistory.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.EmailStatusEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.EmailStatusEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.EmailStatusEnum }),
    tslib_1.__metadata("design:type", String)
], EmailHistory.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.User }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    tslib_1.__metadata("design:type", Object)
], EmailHistory.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmailHistory.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.EmailTemplate }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.EmailTemplate),
    tslib_1.__metadata("design:type", Object)
], EmailHistory.prototype, "emailTemplate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.emailTemplate),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmailHistory.prototype, "emailTemplateId", void 0);
exports.EmailHistory = EmailHistory = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('email_sent', { mikroOrmRepository: () => mikro_orm_email_history_repository_1.MikroOrmEmailHistoryRepository })
], EmailHistory);
//# sourceMappingURL=email-history.entity.js.map