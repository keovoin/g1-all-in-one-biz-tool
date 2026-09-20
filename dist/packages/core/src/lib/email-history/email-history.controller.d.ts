import { UpdateResult } from 'typeorm';
import { ID, IEmailHistory, IPagination, LanguagesEnum } from '@gauzy/contracts';
import { EmailHistory } from './email-history.entity';
import { EmailHistoryService } from './email-history.service';
import { UpdateEmailHistoryDTO } from './dto';
import { BaseQueryDTO } from './../core/crud';
import { ResendEmailHistoryDTO } from './dto/resend-email-history.dto';
import { CommandBus } from '@nestjs/cqrs';
export declare class EmailHistoryController {
    private readonly _emailHistoryService;
    private readonly commandBus;
    constructor(_emailHistoryService: EmailHistoryService, commandBus: CommandBus);
    /**
     * Retrieves all sent emails for a specific tenant with pagination.
     *
     * @param params - Pagination and filter parameters.
     * @returns A paginated list of email histories.
     */
    findAll(params: BaseQueryDTO<EmailHistory>): Promise<IPagination<IEmailHistory>>;
    /**
     * Update an existing email history record.
     *
     * @param id - The UUID of the record to update.
     * @param entity - The update payload.
     * @returns The updated email history record or update result.
     * @throws NotFoundException if no record exists with the given ID.
     * @throws BadRequestException if the update fails due to invalid input.
     */
    update(id: ID, entity: UpdateEmailHistoryDTO): Promise<IEmailHistory | UpdateResult>;
    /**
     * Resend an email invitation.
     *
     * @param entity - The DTO containing the email details to be resent.
     * @param languageCode - The language code to determine the email content language.
     * @returns The update result or updated email history record.
     */
    resendInvite(id: ID, entity: ResendEmailHistoryDTO, languageCode: LanguagesEnum): Promise<UpdateResult | IEmailHistory>;
}
