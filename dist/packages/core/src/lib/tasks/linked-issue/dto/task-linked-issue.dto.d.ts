import { ITaskLinkedIssue } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { TaskLinkedIssue } from '../task-linked-issue.entity';
declare const TaskLinkedIssueDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & TaskLinkedIssue>;
export declare class TaskLinkedIssueDTO extends TaskLinkedIssueDTO_base implements ITaskLinkedIssue {
}
export {};
