"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationPositionDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class OrganizationPositionDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.OrganizationPositionDTO = OrganizationPositionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], OrganizationPositionDTO.prototype, "name", void 0);
//# sourceMappingURL=organization-position.dto.js.map