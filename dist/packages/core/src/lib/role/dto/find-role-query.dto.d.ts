import { IRole, IRoleFindInput } from "@gauzy/contracts";
import { TenantBaseDTO } from "./../../core/dto";
/**
 * Find Role Query DTO validation
 */
export declare class FindRoleQueryDTO extends TenantBaseDTO implements IRoleFindInput {
    readonly name: IRole['name'];
}
