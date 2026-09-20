import { IOrganizationEmploymentTypeCreateInput, ITag } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "./../../core/dto";
export declare class CreateOrganizationEmploymentTypeDTO extends TenantOrganizationBaseDTO implements IOrganizationEmploymentTypeCreateInput {
    readonly name: string;
    readonly tags?: ITag[];
}
