"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSmtp = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const internal_1 = require("../core/entities/internal");
const decorators_1 = require("./../core/decorators");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_custom_smtp_repository_1 = require("./repository/mikro-orm-custom-smtp.repository");
const export_redact_decorator_1 = require("../export-import/export-redact.decorator");
let CustomSmtp = class CustomSmtp extends internal_1.TenantOrganizationBaseEntity {
    /**
     * Get SMTP transporter configuration
     *
     * @returns
     */
    getSmtpTransporter() {
        const normalizedPort = this.port ?? 587;
        const normalizedSecure = normalizedPort === 465 ? true : this.secure || false;
        return {
            fromAddress: this.fromAddress,
            host: this.host,
            port: normalizedPort,
            secure: normalizedSecure,
            auth: {
                user: this.username,
                pass: this.password
            }
        };
    }
};
exports.CustomSmtp = CustomSmtp;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, examples: ['noreply@domain.com'] }),
    (0, class_validator_1.IsEmail)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], CustomSmtp.prototype, "fromAddress", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, examples: ['smtp.postmarkapp.com', 'smtp.gmail.com'] }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CustomSmtp.prototype, "host", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, examples: [587, 465] }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], CustomSmtp.prototype, "port", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, examples: [true, false] }),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], CustomSmtp.prototype, "secure", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)({ opaque: true }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CustomSmtp.prototype, "username", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)({ opaque: true }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CustomSmtp.prototype, "password", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], CustomSmtp.prototype, "isValidate", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)({ toPlainOnly: true, name: 'username' }),
    (0, decorators_1.IsSecret)(),
    tslib_1.__metadata("design:type", String)
], CustomSmtp.prototype, "secretKey", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)({ toPlainOnly: true, name: 'password' }),
    (0, decorators_1.IsSecret)(),
    tslib_1.__metadata("design:type", String)
], CustomSmtp.prototype, "secretPassword", void 0);
exports.CustomSmtp = CustomSmtp = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('custom_smtp', { mikroOrmRepository: () => mikro_orm_custom_smtp_repository_1.MikroOrmCustomSmtpRepository })
], CustomSmtp);
//# sourceMappingURL=custom-smtp.entity.js.map