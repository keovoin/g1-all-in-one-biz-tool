"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTrackingBulkInputDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const process_tracking_data_dto_1 = require("./process-tracking-data.dto");
/**
 * DTO for bulk custom tracking data submission
 */
class CustomTrackingBulkInputDTO {
}
exports.CustomTrackingBulkInputDTO = CustomTrackingBulkInputDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => process_tracking_data_dto_1.ProcessTrackingDataDTO,
        isArray: true,
        required: true,
        description: 'Array of custom tracking data entries to process in bulk'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => process_tracking_data_dto_1.ProcessTrackingDataDTO),
    tslib_1.__metadata("design:type", Array)
], CustomTrackingBulkInputDTO.prototype, "list", void 0);
//# sourceMappingURL=custom-tracking-bulk-input.dto.js.map