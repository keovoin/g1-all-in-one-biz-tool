import { IOrganizationDepartmentCreateInput, ITag } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "./../../core/dto";
export declare class CreateOrganizationDepartmentDTO extends TenantOrganizationBaseDTO implements IOrganizationDepartmentCreateInput {
    readonly name: string;
    readonly tags?: ITag[];
}
