import { ICustomSmtp } from '@gauzy/contracts';
import { ISMTPConfig } from '@gauzy/common';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class CustomSmtp extends TenantOrganizationBaseEntity implements ICustomSmtp {
    fromAddress?: string;
    host: string;
    port: number;
    secure: boolean;
    /**
     * SMTP credentials are stored in cleartext; keep them out of export archives entirely. Opaque
     * rather than hinted: both are human-chosen, so length plus a four-character tail is a real head
     * start for a guess, and the columns are NOT NULL so a blank cell would not import.
     */
    username: string;
    password: string;
    isValidate?: boolean;
    /**
     * Additional fields to expose secret fields
     */
    secretKey?: string;
    secretPassword?: string;
    /**
     * Get SMTP transporter configuration
     *
     * @returns
     */
    getSmtpTransporter?(): ISMTPConfig;
}
