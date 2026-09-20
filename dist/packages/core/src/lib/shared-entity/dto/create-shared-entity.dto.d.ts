import { ISharedEntityCreateInput } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "../../core/dto";
import { SharedEntity } from "../shared-entity.entity";
declare const CreateSharedEntityDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<SharedEntity, "token">>;
/**
 * Create Shared Entity DTO
 */
export declare class CreateSharedEntityDTO extends CreateSharedEntityDTO_base implements ISharedEntityCreateInput {
}
export {};
