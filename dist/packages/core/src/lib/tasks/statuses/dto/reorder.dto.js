"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderRequestDTO = exports.ReorderDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../core/dto");
/**
 * DTO for individual reorder request item.
 */
class ReorderDTO {
}
exports.ReorderDTO = ReorderDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'UUID of the record to reorder' }),
    (0, class_validator_1.IsNotEmpty)() // It should have a value
    ,
    (0, class_validator_1.IsUUID)() // Must be a UUID
    ,
    tslib_1.__metadata("design:type", String)
], ReorderDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'New order for the record' }),
    (0, class_validator_1.IsNotEmpty)() // It should have a value
    ,
    (0, class_validator_1.IsNumber)() // Must be a number
    ,
    tslib_1.__metadata("design:type", Number)
], ReorderDTO.prototype, "order", void 0);
/**
 * DTO for the entire reorder request containing multiple items.
 */
class ReorderRequestDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.ReorderRequestDTO = ReorderRequestDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [ReorderDTO], description: 'List of reordering instructions' }),
    (0, class_validator_1.IsArray)() // Should be an array
    ,
    (0, class_validator_1.ArrayMinSize)(1) // Requires at least one item in the array
    ,
    (0, class_validator_1.ValidateNested)({ each: true }) // Validate each item in the array
    ,
    (0, class_transformer_1.Type)(() => ReorderDTO) // Transform to ReorderDTO
    ,
    tslib_1.__metadata("design:type", Array)
], ReorderRequestDTO.prototype, "reorder", void 0);
//# sourceMappingURL=reorder.dto.js.map