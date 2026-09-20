import { IEmailCheckResponse } from '@gauzy/contracts';
import { CheckEmailDTO } from './dto/check-email.dto';
import { EmailCheckService } from './email-check.service';
export declare class EmailCheckController {
    private readonly emailCheckService;
    constructor(emailCheckService: EmailCheckService);
    /**
     * Checks if the provided email exists in the database.
     *
     * @param query - An object containing the email address to check.
     * @returns A promise resolving to an object `{ exists: boolean }`, indicating whether the email exists.
     */
    checkEmail(query: CheckEmailDTO): Promise<IEmailCheckResponse>;
}
