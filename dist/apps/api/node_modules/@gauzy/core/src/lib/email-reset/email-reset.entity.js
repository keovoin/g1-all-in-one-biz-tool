"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailReset = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_email_reset_repository_1 = require("./repository/mikro-orm-email-reset.repository");
const export_redact_decorator_1 = require("../export-import/export-redact.decorator");
let EmailReset = class EmailReset extends internal_1.TenantBaseEntity {
};
exports.EmailReset = EmailReset;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsEmail)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmailReset.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsEmail)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmailReset.prototype, "oldEmail", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmailReset.prototype, "code", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmailReset.prototype, "token", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], EmailReset.prototype, "expiredAt", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], EmailReset.prototype, "isExpired", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EmailReset.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmailReset.prototype, "userId", void 0);
exports.EmailReset = EmailReset = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('email_reset', { mikroOrmRepository: () => mikro_orm_email_reset_repository_1.MikroOrmEmailResetRepository })
], EmailReset);
//# sourceMappingURL=email-reset.entity.js.map