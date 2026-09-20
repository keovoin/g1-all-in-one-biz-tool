"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindMembersInputDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../core/dto");
/**
 * Employee member query DTO
 */
class FindMembersInputDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.FindMembersInputDTO = FindMembersInputDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], FindMembersInputDTO.prototype, "organizationTeamId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], FindMembersInputDTO.prototype, "organizationProjectId", void 0);
//# sourceMappingURL=find-member-input.dto.js.map