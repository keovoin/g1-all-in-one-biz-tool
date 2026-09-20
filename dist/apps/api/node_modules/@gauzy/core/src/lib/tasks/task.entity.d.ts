import { EntityRepositoryType } from '@mikro-orm/core';
import { IActivity, ID, IDailyPlan, IEmployee, IInvoiceItem, IIssueType, IOrganizationProject, IOrganizationProjectModule, IOrganizationSprint, IOrganizationSprintTaskHistory, IOrganizationTeam, ITag, ITask, ITaskPriority, ITaskSize, ITaskStatus, ITimeLog, TaskPriorityEnum, TaskSizeEnum, TaskStatusEnum, TaskTypeEnum } from '@gauzy/contracts';
import { OrganizationTeamEmployee, TaskEstimation, TaskLinkedIssue, TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmTaskRepository } from './repository/mikro-orm-task.repository';
export declare class Task extends TenantOrganizationBaseEntity implements ITask {
    [EntityRepositoryType]?: MikroOrmTaskRepository;
    /**
     * Represents the title of the task or entity.
     */
    title: string;
    /**
     * Represents a unique identifier or reference number associated with the task.
     */
    number?: number;
    /**
     * A prefix string associated with the task.
     */
    prefix?: string;
    /**
     * A brief summary or explanation of the task.
     */
    description?: string;
    /**
     * The current status of the task.
     */
    status?: TaskStatusEnum;
    /**
     * Indicates the priority level of the task.
     */
    priority?: TaskPriorityEnum;
    /**
     * Specifies the size or complexity of the task.
     */
    size?: TaskSizeEnum;
    /**
     * Defines the type or category of the task.
     */
    issueType?: TaskTypeEnum;
    /**
     * Estimates the amount of time, in hours, required to complete the task.
     */
    estimate?: number;
    /**
     * The due date by which the task should be completed.
     */
    dueDate?: Date;
    /**
     * Indicates whether the task is public or private.
     */
    public?: boolean;
    /**
     * The date when work on the task is scheduled to begin.
     */
    startDate?: Date;
    /**
     * The date and time when the task was marked as resolved.
     */
    resolvedAt?: Date;
    /**
     * The version identifier associated with the task.
     */
    version?: string;
    /**
     * Indicates whether the task is in draft status.
     */
    isDraft?: boolean;
    /**
     * Specifies if the task is designated for screening purposes.
     */
    isScreeningTask?: boolean;
    /**
     * Additional virtual columns
     */
    taskNumber?: string;
    rootEpic?: ITask;
    /**
     * The parent task to which this task is related.
     */
    parent?: Task;
    /**
     * The ID unique identifier of the parent task.
     */
    parentId?: ID;
    /**
     * The project associated with this task.
     */
    project?: IOrganizationProject;
    /**
     * The ID unique identifier of the associated project.
     */
    projectId?: ID;
    /**
     * The sprint within the organization to which this task is assigned.
     */
    organizationSprint?: IOrganizationSprint;
    /**
     * The ID unique identifier of the associated sprint.
     */
    organizationSprintId?: ID;
    /**
     * The current status of the task.
     */
    taskStatus?: ITaskStatus;
    /**
     * The ID unique identifier of the task's status.
     */
    taskStatusId?: ID;
    /**
     * The size classification of the task.
     */
    taskSize?: ITaskSize;
    /**
     * The ID unique identifier of the task's size classification.
     */
    taskSizeId?: ID;
    /**
     * The priority level assigned to the task.
     */
    taskPriority?: ITaskPriority;
    /**
     * The ID unique identifier of the task's priority level.
     */
    taskPriorityId?: ID;
    /**
     * The type of the task.
     */
    taskType?: IIssueType;
    /**
     * The ID unique identifier of the task's type or category.
     */
    taskTypeId?: ID;
    /**
     * Organization Team Employees
     */
    organizationTeamEmployees?: OrganizationTeamEmployee[];
    /**
     * Estimations
     */
    estimations?: TaskEstimation[];
    /**
     * Children Tasks
     */
    children?: Task[];
    /**
     * InvoiceItem
     */
    invoiceItems?: IInvoiceItem[];
    /**
     * TimeLog
     */
    timeLogs?: ITimeLog[];
    /**
     * Activity
     */
    activities?: IActivity[];
    /**
     * Linked Task Issues
     */
    linkedIssues?: TaskLinkedIssue[];
    taskSprints?: IOrganizationSprint[];
    taskSprintHistories?: IOrganizationSprintTaskHistory[];
    /**
     * Daily Planned Tasks
     */
    dailyPlans?: IDailyPlan[];
    /**
     * Task Tags
     */
    tags?: ITag[];
    /**
     * Members
     */
    members?: IEmployee[];
    /**
     * OrganizationTeam
     */
    teams?: IOrganizationTeam[];
    /**
     * Project Module
     */
    modules?: IOrganizationProjectModule[];
}
