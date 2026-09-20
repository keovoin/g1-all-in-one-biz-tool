"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAcceptanceClaimDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * One document a signup / invite-acceptance form says it displayed.
 *
 * These values arrive from a browser, so they are a *claim*, not evidence. The
 * shape checks here only stop obvious rubbish; what makes the claim true is
 * `TermsAcceptanceService`, which re-checks every field against the published
 * legal corpus before a row is written. A digest the corpus never published is
 * rejected outright — recording it would produce evidence pointing at nothing.
 */
class TermsAcceptanceClaimDTO {
}
exports.TermsAcceptanceClaimDTO = TermsAcceptanceClaimDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, example: 'tos:gauzy' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Terms acceptance requires a document id.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], TermsAcceptanceClaimDTO.prototype, "documentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, example: '1.0.0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Terms acceptance requires a document version.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    tslib_1.__metadata("design:type", String)
], TermsAcceptanceClaimDTO.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Lowercase hex sha256 of the document source.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Terms acceptance requires the sha256 of the text that was shown.' }),
    (0, class_validator_1.Matches)(/^[0-9a-f]{64}$/, {
        message: 'sha256 must be a 64-character lowercase hex digest.'
    }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptanceClaimDTO.prototype, "sha256", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, example: 'en' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Terms acceptance requires the locale of the text that was shown.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(35),
    tslib_1.__metadata("design:type", String)
], TermsAcceptanceClaimDTO.prototype, "locale", void 0);
//# sourceMappingURL=terms-acceptance-claim.dto.js.map