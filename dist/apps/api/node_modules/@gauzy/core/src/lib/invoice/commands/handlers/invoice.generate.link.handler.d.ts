import { IInvoice } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { InvoiceService } from '../../invoice.service';
import { InvoiceGenerateLinkCommand } from '../invoice.generate.link.command';
export declare class InvoiceGenerateLinkHandler implements ICommandHandler<InvoiceGenerateLinkCommand> {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    execute(command: InvoiceGenerateLinkCommand): Promise<IInvoice>;
}
