"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentLinksQueryDTO = exports.CreateDocumentLinkDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
/**
 * Create payload for `POST /api/plugins/docs/links` — idempotent on
 * `(documentId, entity, entityId)`; a duplicate returns the existing row with 200.
 */
class CreateDocumentLinkDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.CreateDocumentLinkDTO = CreateDocumentLinkDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateDocumentLinkDTO.prototype, "documentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    tslib_1.__metadata("design:type", String)
], CreateDocumentLinkDTO.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateDocumentLinkDTO.prototype, "entityId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CreateDocumentLinkDTO.prototype, "metadata", void 0);
/**
 * Query params for `GET /api/plugins/docs/links` — the "Documents panel" reverse lookup.
 *
 * Extends a partial `TenantOrganizationBaseDTO` so `organizationId` carries the same
 * `@IsOrganizationBelongsToUser()` ownership check as the sibling write DTO: a caller can never
 * name an organization they do not belong to. It stays **optional** — the service falls back to
 * the requester's current organization when it is omitted.
 */
class GetDocumentLinksQueryDTO extends (0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO) {
}
exports.GetDocumentLinksQueryDTO = GetDocumentLinksQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    tslib_1.__metadata("design:type", String)
], GetDocumentLinksQueryDTO.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], GetDocumentLinksQueryDTO.prototype, "entityId", void 0);
//# sourceMappingURL=document-link.dto.js.map