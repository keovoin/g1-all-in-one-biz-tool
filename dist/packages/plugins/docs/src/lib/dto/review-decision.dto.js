"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectReviewDTO = exports.ApproveReviewDTO = exports.RequestReviewDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Body of `POST /api/plugins/docs/documents/:id/review/request` (§4.9).
 */
class RequestReviewDTO {
}
exports.RequestReviewDTO = RequestReviewDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Why the review is requested' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    tslib_1.__metadata("design:type", String)
], RequestReviewDTO.prototype, "reason", void 0);
/**
 * Body of `POST /api/plugins/docs/documents/:id/review/approve`.
 */
class ApproveReviewDTO {
}
exports.ApproveReviewDTO = ApproveReviewDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    tslib_1.__metadata("design:type", String)
], ApproveReviewDTO.prototype, "note", void 0);
/**
 * Body of `POST /api/plugins/docs/documents/:id/review/reject` — same `reason` field name
 * as the bulk `REVIEW_REJECT` payload.
 */
class RejectReviewDTO {
}
exports.RejectReviewDTO = RejectReviewDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    tslib_1.__metadata("design:type", String)
], RejectReviewDTO.prototype, "reason", void 0);
//# sourceMappingURL=review-decision.dto.js.map