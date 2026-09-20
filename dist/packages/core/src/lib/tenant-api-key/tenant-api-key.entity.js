"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantApiKey = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const is_secret_1 = require("../core/decorators/is-secret");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_tenant_api_key_repository_1 = require("./repository/mikro-orm-tenant-api-key.repository");
const export_redact_decorator_1 = require("../export-import/export-redact.decorator");
let TenantApiKey = class TenantApiKey extends internal_1.TenantBaseEntity {
};
exports.TenantApiKey = TenantApiKey;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'The name or identifier of the client or user consuming the API.',
        minLength: 1,
        maxLength: 255
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TenantApiKey.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => String,
        description: 'The API Key for authentication.'
    }),
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, is_secret_1.IsSecret)(),
    (0, class_transformer_1.Exclude)() // Exclude from serialization
    ,
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TenantApiKey.prototype, "apiKey", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => String,
        description: 'The API Secret for secure authentication.'
    })
    // Stored as a SHA-256 digest (`TenantApiKeyService.generateApiKey`): blank, never hint a digest.
    ,
    (0, export_redact_decorator_1.ExportRedacted)({ blank: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, is_secret_1.IsSecret)(),
    (0, class_transformer_1.Exclude)() // Exclude from serialization
    ,
    (0, entity_1.MultiORMColumn)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], TenantApiKey.prototype, "apiSecret", void 0);
exports.TenantApiKey = TenantApiKey = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('tenant_api_key', { mikroOrmRepository: () => mikro_orm_tenant_api_key_repository_1.MikroOrmTenantApiKeyRepository })
], TenantApiKey);
//# sourceMappingURL=tenant-api-key.entity.js.map