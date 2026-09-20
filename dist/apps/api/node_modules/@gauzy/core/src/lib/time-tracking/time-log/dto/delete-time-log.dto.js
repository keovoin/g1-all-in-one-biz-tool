"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTimeLogDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../core/dto");
/**
 * Data Transfer Object (DTO) for deleting time logs with the `forceDelete` flag.
 * This DTO extends the `ForceDeleteBaseDTO` to include the `forceDelete` flag.
 */
class DeleteTimeLogDTO extends dto_1.ForceDeleteBaseDTO {
    constructor() {
        super(...arguments);
        /**
         * An array of time log IDs that need to be deleted.
         * This field is required and must contain at least one ID.
         */
        this.logIds = [];
    }
}
exports.DeleteTimeLogDTO = DeleteTimeLogDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array }),
    (0, class_validator_1.ArrayNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], DeleteTimeLogDTO.prototype, "logIds", void 0);
//# sourceMappingURL=delete-time-log.dto.js.map