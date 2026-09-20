import { IIssueTypeCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { IssueType } from '../issue-type.entity';
declare const CreateIssueTypeDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO> & IssueType>;
export declare class CreateIssueTypeDTO extends CreateIssueTypeDTO_base implements IIssueTypeCreateInput {
}
export {};
