"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItemBulkInputDTO = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const _1 = require(".");
class InvoiceItemBulkInputDTO {
}
exports.InvoiceItemBulkInputDTO = InvoiceItemBulkInputDTO;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => _1.CreateInvoiceItemDTO),
    tslib_1.__metadata("design:type", Array)
], InvoiceItemBulkInputDTO.prototype, "list", void 0);
//# sourceMappingURL=invoice-item-bulk-input.dto.js.map