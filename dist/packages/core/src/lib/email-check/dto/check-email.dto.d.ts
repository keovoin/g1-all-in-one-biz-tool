import { IEmailCheckRequest } from '@gauzy/contracts';
/**
 * DTO for checking if an email exists in the database.
 * Used in the POST method to check the existence of an email.
 */
export declare class CheckEmailDTO implements IEmailCheckRequest {
    /**
     * The email address to check in the database.
     */
    email: string;
}
