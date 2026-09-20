import { IPasswordReset } from '@gauzy/contracts';
import { TenantBaseEntity } from './../core/entities/tenant-base.entity';
export declare class PasswordReset extends TenantBaseEntity implements IPasswordReset {
    /**
     * The `email` column stores the user's email address.
     *
     * @example "user@example.com"
     */
    email: string;
    /**
     * Token field to store a long string (text).
     *
     */
    token: string;
    /**
     * Virtual column to indicate if the token or record is expired.
     *
     * This field is not stored in the database but is computed dynamically.
     *
     * @example false
     */
    expired?: boolean;
    /**
     * Called after entity is loaded to check if the entity is expired.
     */
    afterLoadEntity?(): void;
}
