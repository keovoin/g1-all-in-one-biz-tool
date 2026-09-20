import { HttpClient } from '@angular/common/http';
import { IEmailHistory, IEmailFindInput, IEmailUpdateInput, IPagination, IResendEmailInput, ID } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class EmailService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Retrieves a paginated list of email history records.
     *
     * @param relations - An array of relation names to include (default is an empty array).
     * @param where - Optional filtering criteria for the email history records.
     * @param take - Optional limit on the number of records to retrieve.
     * @returns A promise that resolves to a paginated list of email history records.
     */
    getAll(relations?: string[], where?: IEmailFindInput, take?: number): Promise<IPagination<IEmailHistory>>;
    /**
     * Updates an email history record with the given update input.
     *
     * @param id - The unique identifier of the email record.
     * @param body - The payload containing the update details.
     * @returns A promise that resolves to the updated email history record.
     */
    update(id: ID, body: IEmailUpdateInput): Promise<IEmailHistory>;
    /**
     * Resend an email based on the provided input.
     *
     * @param id - The unique identifier of the email record to resend.
     * @param input - The payload containing resend details.
     * @returns A promise that resolves to the email history record after resending.
     */
    resend(id: ID, input: IResendEmailInput): Promise<IEmailHistory>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmailService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmailService>;
}
