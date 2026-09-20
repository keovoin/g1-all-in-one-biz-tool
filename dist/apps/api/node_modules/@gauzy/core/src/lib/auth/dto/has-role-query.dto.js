"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasRoleQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class HasRoleQueryDTO {
}
exports.HasRoleQueryDTO = HasRoleQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array }),
    (0, class_validator_1.IsNotEmpty)({
        message: "roles should not be empty!"
    }),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], HasRoleQueryDTO.prototype, "roles", void 0);
//# sourceMappingURL=has-role-query.dto.js.map