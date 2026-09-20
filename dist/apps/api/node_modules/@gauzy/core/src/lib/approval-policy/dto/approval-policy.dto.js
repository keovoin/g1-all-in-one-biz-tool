"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalPolicyDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class ApprovalPolicyDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.ApprovalPolicyDTO = ApprovalPolicyDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], ApprovalPolicyDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], ApprovalPolicyDTO.prototype, "description", void 0);
//# sourceMappingURL=approval-policy.dto.js.map