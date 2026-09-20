import { ICandidateSkillUpdateInput } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "./../../core/dto";
export declare class UpdateCandidateSkillDTO extends TenantOrganizationBaseDTO implements ICandidateSkillUpdateInput {
    readonly name: string;
}
