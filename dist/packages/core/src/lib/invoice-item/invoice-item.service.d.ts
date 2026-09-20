import { ID, IInvoiceItem, IInvoiceItemCreateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { InvoiceItem } from './invoice-item.entity';
import { MikroOrmInvoiceItemRepository } from './repository/mikro-orm-invoice-item.repository';
import { TypeOrmInvoiceItemRepository } from './repository/type-orm-invoice-item.repository';
export declare class InvoiceItemService extends TenantAwareCrudService<InvoiceItem> {
    constructor(typeOrmInvoiceItemRepository: TypeOrmInvoiceItemRepository, mikroOrmInvoiceItemRepository: MikroOrmInvoiceItemRepository);
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
    createBulk(invoiceId: ID, input: IInvoiceItemCreateInput[]): Promise<IInvoiceItem[]>;
}
