"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentInboundAddressDTO = exports.CreateDocumentInboundAddressDTO = exports.DocumentInboundAddressQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
/** Upper bound on allowlist entries — a settings field, not a mailing list. */
const MAX_ALLOWLIST_ENTRIES = 200;
/**
 * Normalizes an allowlist supplied either as a real array or as a CSV string (which is what a
 * form control naturally produces).
 */
const parseAllowlist = ({ value }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const entries = Array.isArray(value) ? value : String(value).split(',');
    return entries
        .map((entry) => String(entry).trim().toLowerCase())
        .filter((entry) => entry.length > 0);
};
/** Scope for the list/read routes. */
class DocumentInboundAddressQueryDTO {
}
exports.DocumentInboundAddressQueryDTO = DocumentInboundAddressQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddressQueryDTO.prototype, "organizationId", void 0);
/**
 * Create input.
 *
 * `PLATFORM` addresses are minted automatically on first read, so in practice this endpoint is
 * used for `CUSTOM_DOMAIN`. `domain`/`localPart` are validated properly in the service (label by
 * label) — the decorators here only bound the size of what reaches it.
 */
class CreateDocumentInboundAddressDTO {
}
exports.CreateDocumentInboundAddressDTO = CreateDocumentInboundAddressDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateDocumentInboundAddressDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentInboundAddressKindEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentInboundAddressKindEnum),
    tslib_1.__metadata("design:type", String)
], CreateDocumentInboundAddressDTO.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], CreateDocumentInboundAddressDTO.prototype, "domain", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    tslib_1.__metadata("design:type", String)
], CreateDocumentInboundAddressDTO.prototype, "localPart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseAllowlist),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(MAX_ALLOWLIST_ENTRIES),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(320, { each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateDocumentInboundAddressDTO.prototype, "senderAllowlist", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateDocumentInboundAddressDTO.prototype, "importBodyAsNote", void 0);
/**
 * Update input. `kind`, `token`, `domain` and `address` are deliberately absent — they are
 * server-owned, and changing an address is a rotation rather than an edit.
 */
class UpdateDocumentInboundAddressDTO {
}
exports.UpdateDocumentInboundAddressDTO = UpdateDocumentInboundAddressDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], UpdateDocumentInboundAddressDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseAllowlist),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(MAX_ALLOWLIST_ENTRIES),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(320, { each: true }),
    tslib_1.__metadata("design:type", Array)
], UpdateDocumentInboundAddressDTO.prototype, "senderAllowlist", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateDocumentInboundAddressDTO.prototype, "importBodyAsNote", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateDocumentInboundAddressDTO.prototype, "isActive", void 0);
//# sourceMappingURL=document-inbound-address.dto.js.map