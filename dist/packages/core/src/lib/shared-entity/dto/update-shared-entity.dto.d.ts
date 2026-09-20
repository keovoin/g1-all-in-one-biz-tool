import { ISharedEntityUpdateInput } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "../../core/dto";
import { SharedEntity } from "../shared-entity.entity";
declare const UpdateSharedEntityDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<SharedEntity, "entity" | "entityId" | "token">>;
/**
 * Update Shared Entity DTO
 */
export declare class UpdateSharedEntityDTO extends UpdateSharedEntityDTO_base implements ISharedEntityUpdateInput {
}
export {};
