import { ICandidateSourceCreateInput } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "./../../core/dto";
export declare class CreateCandidateSourceDTO extends TenantOrganizationBaseDTO implements ICandidateSourceCreateInput {
    readonly name: string;
}
