import { IProposalCreateInput } from "@gauzy/contracts";
import { EmployeeFeatureDTO, RelationalTagDTO } from "@gauzy/core";
import { ProposalDTO } from "./proposal.dto";
declare const CreateProposalDTO_base: import("@nestjs/mapped-types").MappedType<ProposalDTO & Partial<EmployeeFeatureDTO> & RelationalTagDTO>;
/**
 * Create proposal request DTO validation
 */
export declare class CreateProposalDTO extends CreateProposalDTO_base implements IProposalCreateInput {
}
export {};
