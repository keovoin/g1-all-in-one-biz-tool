"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItemBulkCreateCommand = void 0;
class InvoiceItemBulkCreateCommand {
    constructor(invoiceId, input) {
        this.invoiceId = invoiceId;
        this.input = input;
    }
}
exports.InvoiceItemBulkCreateCommand = InvoiceItemBulkCreateCommand;
InvoiceItemBulkCreateCommand.type = '[InvoiceItem] Create';
//# sourceMappingURL=invoice-item.bulk.create.command.js.map