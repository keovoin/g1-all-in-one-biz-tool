import { IRoleCreateInput } from "@gauzy/contracts";
import { TenantBaseDTO } from "./../../core/dto";
/**
 * Create Role DTO validation
 */
export declare class CreateRoleDTO extends TenantBaseDTO implements IRoleCreateInput {
    readonly name: string;
}
