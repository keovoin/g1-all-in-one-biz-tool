"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReset = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const moment = require("moment");
const class_validator_1 = require("class-validator");
const tenant_base_entity_1 = require("./../core/entities/tenant-base.entity");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_password_reset_repository_1 = require("./repository/mikro-orm-password-reset.repository");
const export_redact_decorator_1 = require("./../export-import/export-redact.decorator");
let PasswordReset = class PasswordReset extends tenant_base_entity_1.TenantBaseEntity {
    /**
     * Called after entity is loaded to check if the entity is expired.
     */
    afterLoadEntity() {
        // Calculate the difference between current time and createdAt in minutes
        const expiredAt = moment();
        this.expired = expiredAt.diff(moment(this.createdAt), 'minutes') > 10;
    }
};
exports.PasswordReset = PasswordReset;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], PasswordReset.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], PasswordReset.prototype, "token", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], PasswordReset.prototype, "expired", void 0);
tslib_1.__decorate([
    (0, typeorm_1.AfterLoad)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], PasswordReset.prototype, "afterLoadEntity", null);
exports.PasswordReset = PasswordReset = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('password_reset', { mikroOrmRepository: () => mikro_orm_password_reset_repository_1.MikroOrmPasswordResetRepository })
], PasswordReset);
//# sourceMappingURL=password-reset.entity.js.map