import { ID, ITask, ITaskLinkedIssue, TaskRelatedIssuesRelationEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from './../../core/entities/internal';
export declare class TaskLinkedIssue extends TenantOrganizationBaseEntity implements ITaskLinkedIssue {
    action: TaskRelatedIssuesRelationEnum;
    taskFrom?: ITask;
    taskFromId: ID;
    /**
     * Task Linked Issues
     */
    taskTo?: ITask;
    taskToId: ID;
}
