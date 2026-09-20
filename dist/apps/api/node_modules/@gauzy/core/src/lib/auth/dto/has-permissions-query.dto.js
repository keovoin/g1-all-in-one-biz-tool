"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasPermissionsQueryDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class HasPermissionsQueryDTO {
    constructor() {
        this.permissions = [];
    }
}
exports.HasPermissionsQueryDTO = HasPermissionsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array, isArray: true, required: true }),
    (0, class_validator_1.IsEnum)(contracts_1.PermissionsEnum, { each: true }),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], HasPermissionsQueryDTO.prototype, "permissions", void 0);
//# sourceMappingURL=has-permissions-query.dto.js.map