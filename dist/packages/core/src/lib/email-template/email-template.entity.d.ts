import { IEmailTemplate } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmailTemplate extends TenantOrganizationBaseEntity implements IEmailTemplate {
    name: string;
    languageCode: string;
    mjml: string;
    hbs: string;
    /** Additional virtual columns */
    title?: string;
}
