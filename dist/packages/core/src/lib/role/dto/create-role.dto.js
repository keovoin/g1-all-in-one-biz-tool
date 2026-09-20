"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoleDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
const dto_1 = require("./../../core/dto");
/**
 * Create Role DTO validation
 */
class CreateRoleDTO extends dto_1.TenantBaseDTO {
}
exports.CreateRoleDTO = CreateRoleDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, validators_1.IsRoleAlreadyExist)(),
    tslib_1.__metadata("design:type", String)
], CreateRoleDTO.prototype, "name", void 0);
//# sourceMappingURL=create-role.dto.js.map