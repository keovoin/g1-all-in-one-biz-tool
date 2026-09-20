import { IEmailUpdateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
export declare class UpdateEmailHistoryDTO extends TenantOrganizationBaseDTO implements IEmailUpdateInput {
    readonly isArchived?: boolean;
}
