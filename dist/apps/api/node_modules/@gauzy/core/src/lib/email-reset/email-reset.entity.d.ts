import { ID, IEmailReset, IUser } from '@gauzy/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
export declare class EmailReset extends TenantBaseEntity implements IEmailReset {
    /**
     * The email associated with the email reset.
     */
    email: string;
    /**
     * The old email used to verify the email reset.
     */
    oldEmail: string;
    /**
     * The code used to verify the email reset.
     */
    code: string;
    /**
     * The token used to verify the email reset.
     */
    token: string;
    /**
     * The date when the email reset will expire.
     */
    expiredAt: Date;
    /**
     * Additional Virtual Columns
     */
    isExpired: boolean;
    /**
     * The user associated with the email reset.
     */
    user?: IUser;
    /**
     * The ID of the user associated with the email reset.
     */
    userId?: ID;
}
