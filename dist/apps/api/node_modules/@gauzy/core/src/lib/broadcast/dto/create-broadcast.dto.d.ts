import { IBroadcastCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { Broadcast } from '../broadcast.entity';
declare const CreateBroadcastDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<Broadcast, "employee" | "employeeId">>;
/**
 * Create Broadcast data validation request DTO
 */
export declare class CreateBroadcastDTO extends CreateBroadcastDTO_base implements IBroadcastCreateInput {
}
export {};
