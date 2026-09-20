"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentShareDTO = exports.CreateDocumentShareDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
/**
 * Body of `POST /api/plugins/docs/documents/:id/shares` (03 §4.12).
 *
 * Exactly one of `employeeId` / `teamId` must be present — both or neither is a 400
 * `DOCS_SHARE_TARGET`. The XOR itself is enforced in the service (and by the
 * `CHK_document_share_target_xor` CHECK constraint) because class-validator cannot express
 * "exactly one of" without a custom validator.
 */
class CreateDocumentShareDTO {
}
exports.CreateDocumentShareDTO = CreateDocumentShareDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateDocumentShareDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreateDocumentShareDTO.prototype, "teamId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentShareAccessEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentShareAccessEnum),
    tslib_1.__metadata("design:type", String)
], CreateDocumentShareDTO.prototype, "access", void 0);
/**
 * Body of `PUT /api/plugins/docs/documents/:id/shares/:shareId` — the access level is the
 * only mutable field; re-targeting a share means deleting it and creating a new one.
 */
class UpdateDocumentShareDTO {
}
exports.UpdateDocumentShareDTO = UpdateDocumentShareDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentShareAccessEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentShareAccessEnum),
    tslib_1.__metadata("design:type", String)
], UpdateDocumentShareDTO.prototype, "access", void 0);
//# sourceMappingURL=document-share.dto.js.map