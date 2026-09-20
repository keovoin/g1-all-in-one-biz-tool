import { CurrenciesEnum, IActivity, ID, IEmployee, IExpense, IImageAsset, IInvoiceItem, IOrganizationContact, IOrganizationProject, IOrganizationProjectEmployee, IOrganizationProjectModule, IOrganizationSprint, IOrganizationTeam, IPayment, IOrganizationStrategicInitiative, ITag, ITask, ITaskPriority, ITaskRelatedIssueType, ITaskSize, ITaskStatus, ITaskVersion, ITaskView, ITimeLog, OrganizationProjectBudgetTypeEnum, ProjectBillingEnum, ProjectOwnerEnum, ProjectStatusEnum, TaskListTypeEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { OrganizationProjectEntityCustomFields } from '../core/entities/custom-entity-fields/organization-project';
import { HasCustomFields } from '../core/entities/custom-entity-fields';
import { Taggable } from '../tags/tag.types';
export declare class OrganizationProject extends TenantOrganizationBaseEntity implements IOrganizationProject, Taggable, HasCustomFields {
    name: string;
    startDate?: Date;
    endDate?: Date;
    billing?: ProjectBillingEnum;
    currency?: CurrenciesEnum;
    public?: boolean;
    owner?: ProjectOwnerEnum;
    taskListType?: TaskListTypeEnum;
    code?: string;
    description?: string;
    color?: string;
    billable?: boolean;
    billingFlat?: boolean;
    openSource?: boolean;
    projectUrl?: string;
    openSourceProjectUrl?: string;
    budget?: number;
    budgetType?: OrganizationProjectBudgetTypeEnum;
    imageUrl?: string;
    icon?: string;
    status?: ProjectStatusEnum;
    isTasksAutoSync?: boolean;
    isTasksAutoSyncOnLabel?: boolean;
    syncTag?: string;
    archiveTasksIn?: number;
    closeTasksIn?: number;
    membersCount?: number;
    /**
     * Organization Contact Relationship
     */
    organizationContact?: IOrganizationContact;
    /**
     * Organization Contact ID
     */
    organizationContactId?: ID;
    /**
     * ImageAsset Relationship
     */
    image?: IImageAsset;
    /**
     * Image Asset ID
     */
    imageId?: ID;
    /**
     * Project Default Assignee
     */
    defaultAssignee?: IEmployee;
    defaultAssigneeId?: ID;
    /**
     * OrganizationTeamEmployee
     */
    members?: IOrganizationProjectEmployee[];
    /**
     * Organization Tasks Relationship
     */
    tasks?: ITask[];
    /**
     * TimeLog Relationship
     */
    timeLogs?: ITimeLog[];
    /**
     * Organization Invoice Items Relationship
     */
    invoiceItems?: IInvoiceItem[];
    /**
     * Organization Sprints Relationship
     */
    organizationSprints?: IOrganizationSprint[];
    /**
     * Organization Payments Relationship
     */
    payments?: IPayment[];
    /**
     * Expense Relationship
     */
    expenses?: IExpense[];
    /**
     * Activity Relationship
     */
    activities?: IActivity[];
    /**
     * Project Statuses
     */
    statuses?: ITaskStatus[];
    /**
     * Project Related Issue Type Relationship
     */
    relatedIssueTypes?: ITaskRelatedIssueType[];
    /**
     * Project Priorities Relationship
     */
    priorities?: ITaskPriority[];
    /**
     * Project Sizes Relationship
     */
    sizes?: ITaskSize[];
    /**
     * Project Versions Relationship
     */
    versions?: ITaskVersion[];
    /**
     * Project views Relationship
     */
    views?: ITaskView[];
    /**
     * Organization modules Relationship
     */
    modules?: IOrganizationProjectModule[];
    /**
     * Tags Relationship
     */
    tags?: ITag[];
    /**
     * Organization Teams Relationship
     */
    teams?: IOrganizationTeam[];
    /**
     * Organization Strategic Initiatives Relationship (ManyToMany)
     * A project can contribute to multiple strategic directions simultaneously
     * This provides strategic context: "Why does this project exist?"
     */
    organizationStrategicInitiatives?: IOrganizationStrategicInitiative[];
    customFields?: OrganizationProjectEntityCustomFields;
}
