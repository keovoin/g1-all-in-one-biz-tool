"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindRoleQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("./../../core/dto");
/**
 * Find Role Query DTO validation
 */
class FindRoleQueryDTO extends dto_1.TenantBaseDTO {
    constructor() {
        super(...arguments);
        this.name = contracts_1.RolesEnum.EMPLOYEE;
    }
}
exports.FindRoleQueryDTO = FindRoleQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", Object)
], FindRoleQueryDTO.prototype, "name", void 0);
//# sourceMappingURL=find-role-query.dto.js.map