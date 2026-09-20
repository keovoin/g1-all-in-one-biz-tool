import { CommandBus } from '@nestjs/cqrs';
import { IInvoiceItem, IPagination } from '@gauzy/contracts';
import { CrudController } from './../core/crud';
import { InvoiceItem } from './invoice-item.entity';
import { InvoiceItemService } from './invoice-item.service';
import { InvoiceItemBulkInputDTO } from './dto';
export declare class InvoiceItemController extends CrudController<InvoiceItem> {
    private readonly invoiceItemService;
    private readonly commandBus;
    constructor(invoiceItemService: InvoiceItemService, commandBus: CommandBus);
    findAll(data: any): Promise<IPagination<IInvoiceItem>>;
    createBulk(invoiceId: string, input: InvoiceItemBulkInputDTO): Promise<any>;
}
