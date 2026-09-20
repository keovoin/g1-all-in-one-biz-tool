"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
class ProposalDTO extends core_1.TenantOrganizationBaseDTO {
    constructor() {
        super(...arguments);
        this.status = contracts_1.ProposalStatusEnum.SENT;
    }
}
exports.ProposalDTO = ProposalDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProposalDTO.prototype, "jobPostUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Date)
], ProposalDTO.prototype, "valueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProposalDTO.prototype, "jobPostContent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProposalDTO.prototype, "proposalContent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.ProposalStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.ProposalStatusEnum),
    tslib_1.__metadata("design:type", String)
], ProposalDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], ProposalDTO.prototype, "organizationContact", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ProposalDTO.prototype, "organizationContactId", void 0);
//# sourceMappingURL=proposal.dto.js.map