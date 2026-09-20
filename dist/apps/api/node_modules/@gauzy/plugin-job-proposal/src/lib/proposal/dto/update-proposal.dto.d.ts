import { IProposalCreateInput } from "@gauzy/contracts";
import { RelationalTagDTO } from "@gauzy/core";
import { ProposalDTO } from "./proposal.dto";
declare const UpdateProposalDTO_base: import("@nestjs/mapped-types").MappedType<RelationalTagDTO & Partial<Omit<ProposalDTO, "valueDate">>>;
/**
 * Update proposal request DTO validation
 */
export declare class UpdateProposalDTO extends UpdateProposalDTO_base implements IProposalCreateInput {
}
export {};
