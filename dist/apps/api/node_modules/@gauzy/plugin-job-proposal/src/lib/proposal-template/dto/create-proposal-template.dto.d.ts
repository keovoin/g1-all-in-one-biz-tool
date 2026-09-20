import { IEmployeeProposalTemplateCreateInput } from '@gauzy/contracts';
import { EmployeeFeatureDTO } from '@gauzy/core';
import { ProposalTemplateDTO } from './proposal-template.dto';
declare const CreateProposalTemplateDTO_base: import("@nestjs/mapped-types").MappedType<EmployeeFeatureDTO & ProposalTemplateDTO>;
/**
 * Create proposal template request DTO validation
 *
 */
export declare class CreateProposalTemplateDTO extends CreateProposalTemplateDTO_base implements IEmployeeProposalTemplateCreateInput {
}
export {};
