import { IAccountingTemplate } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class AccountingTemplate extends TenantOrganizationBaseEntity implements IAccountingTemplate {
    name?: string;
    languageCode?: string;
    mjml?: string;
    hbs?: string;
    templateType?: string;
}
