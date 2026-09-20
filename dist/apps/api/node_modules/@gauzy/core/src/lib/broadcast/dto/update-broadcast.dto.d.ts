import { IBroadcastUpdateInput } from '@gauzy/contracts';
import { CreateBroadcastDTO } from './create-broadcast.dto';
declare const UpdateBroadcastDTO_base: import("@nestjs/common").Type<Partial<Omit<CreateBroadcastDTO, "entity" | "entityId">>>;
/**
 * Update Broadcast data validation request DTO
 * Cannot update entity, entityId, employeeId after creation
 */
export declare class UpdateBroadcastDTO extends UpdateBroadcastDTO_base implements IBroadcastUpdateInput {
}
export {};
