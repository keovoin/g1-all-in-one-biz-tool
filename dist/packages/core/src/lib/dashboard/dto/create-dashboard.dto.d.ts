import { IDashboardCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { Dashboard } from '../dashboard.entity';
declare const CreateDashboardDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<Dashboard, "createdByUser" | "createdByUserId" | "isDefault">>;
/**
 * Create Dashboard validation request DTO
 */
export declare class CreateDashboardDTO extends CreateDashboardDTO_base implements IDashboardCreateInput {
}
export {};
