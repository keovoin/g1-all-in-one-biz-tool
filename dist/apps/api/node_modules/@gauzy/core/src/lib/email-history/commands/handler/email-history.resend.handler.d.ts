import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IEmailHistory } from '@gauzy/contracts';
import { EmailService } from '../../../email-send/email.service';
import { EmailHistoryResendCommand } from '../email-history.resend.command';
export declare class EmailHistoryResendHandler implements ICommandHandler<EmailHistoryResendCommand> {
    private readonly emailService;
    constructor(emailService: EmailService);
    /**
     * Executes the EmailHistoryResendCommand to resend an email.
     *
     * @param command - The command containing email input and language code.
     * @returns A promise that resolves with either an UpdateResult or an updated IEmailHistory.
     */
    execute(command: EmailHistoryResendCommand): Promise<UpdateResult | IEmailHistory>;
}
