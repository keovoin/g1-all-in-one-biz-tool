"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItemService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_invoice_item_repository_1 = require("./repository/mikro-orm-invoice-item.repository");
const type_orm_invoice_item_repository_1 = require("./repository/type-orm-invoice-item.repository");
let InvoiceItemService = class InvoiceItemService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmInvoiceItemRepository, mikroOrmInvoiceItemRepository) {
        super(typeOrmInvoiceItemRepository, mikroOrmInvoiceItemRepository);
    }
    /**
     * Creates multiple invoice items in bulk after removing existing ones for the given invoice.
     *
     * @param {ID} invoiceId - The unique identifier of the invoice.
     * @param {IInvoiceItemCreateInput[]} input - An array of invoice items to be created.
     * @returns {Promise<IInvoiceItem[]>} - A promise resolving to the newly created invoice items.
     *
     * @throws {HttpException} - Throws an error if the operation fails.
     *
     * @description
     * This method first deletes any existing invoice items associated with the given `invoiceId`
     * to ensure that only the new items are stored. It then performs a bulk insert operation
     * to save the provided invoice items in the database.
     */
    async createBulk(invoiceId, input) {
        try {
            // Remove existing invoice items for the given invoice
            await this.delete({ invoiceId });
            // Insert new invoice items
            return await this.saveMany(input);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to create bulk invoice items: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.InvoiceItemService = InvoiceItemService;
exports.InvoiceItemService = InvoiceItemService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_invoice_item_repository_1.TypeOrmInvoiceItemRepository,
        mikro_orm_invoice_item_repository_1.MikroOrmInvoiceItemRepository])
], InvoiceItemService);
//# sourceMappingURL=invoice-item.service.js.map