"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationalWarehouseDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RelationalWarehouseDTO {
}
exports.RelationalWarehouseDTO = RelationalWarehouseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], RelationalWarehouseDTO.prototype, "warehouses", void 0);
//# sourceMappingURL=relational-warehouse.dto.js.map