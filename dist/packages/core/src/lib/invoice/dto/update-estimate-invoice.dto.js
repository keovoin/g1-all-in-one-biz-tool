"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEstimateInvoiceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateEstimateInvoiceDTO {
}
exports.UpdateEstimateInvoiceDTO = UpdateEstimateInvoiceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateEstimateInvoiceDTO.prototype, "isAccepted", void 0);
//# sourceMappingURL=update-estimate-invoice.dto.js.map