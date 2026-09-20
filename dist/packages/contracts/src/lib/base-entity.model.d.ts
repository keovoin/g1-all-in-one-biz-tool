import { ITenant } from './tenant.model';
import { IOrganization } from './organization.model';
import { IUser } from './user.model';
export type JsonData = Record<string, any> | string;
/**
 * Dynamically excludes the default system-managed fields ('id', 'createdAt', 'updatedAt')
 * along with any additional keys provided.
 *
 * @template T - The original type.
 * @template K - (Optional) Additional keys to omit from T.
 */
export type OmitFields<T, K extends keyof T = never> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | K>;
/**
 * @description
 * An entity ID. Represents a unique identifier as a string.
 *
 * @docsCategory Type Definitions
 * @docsSubcategory Identifiers
 */
export type ID = string;
export interface IBaseRelationsEntityModel {
    relations?: string[];
}
export interface IBaseSoftDeleteEntityModel {
    deletedAt?: Date;
}
export interface IBaseEntityModel extends IBaseEntityActionByUserModel, IBaseSoftDeleteEntityModel {
    id?: ID;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    isActive?: boolean;
    isArchived?: boolean;
    archivedAt?: Date;
}
export interface IBaseEntityActionByUserModel {
    createdByUser?: IUser;
    createdByUserId?: ID;
    updatedByUser?: IUser;
    updatedByUserId?: ID;
    deletedByUser?: IUser;
    deletedByUserId?: ID;
}
export interface IBasePerTenantEntityModel extends IBaseEntityModel {
    tenantId?: ID;
    tenant?: ITenant;
}
export interface IBasePerTenantEntityMutationInput extends IBaseEntityModel {
    tenantId?: ID;
    tenant?: Partial<ITenant>;
}
export interface IBasePerTenantAndOrganizationEntityModel extends IBasePerTenantEntityModel {
    organizationId?: ID;
    organization?: IOrganization;
}
export interface IBasePerTenantAndOrganizationEntityMutationInput extends Partial<IBasePerTenantEntityMutationInput> {
    organizationId?: ID;
    organization?: Partial<IOrganization>;
}
export interface IBasePerEntityType extends IBasePerTenantAndOrganizationEntityModel {
    entityId: ID;
    entity: BaseEntityEnum;
}
export declare enum ActorTypeEnum {
    System = "System",// System performed the action
    User = "User"
}
export declare enum BaseEntityEnum {
    Broadcast = "Broadcast",
    Candidate = "Candidate",
    Comment = "Comment",
    Contact = "Contact",
    Currency = "Currency",
    DailyPlan = "DailyPlan",
    Dashboard = "Dashboard",
    DashboardWidget = "DashboardWidget",
    Document = "Document",
    Employee = "Employee",
    Expense = "Expense",
    Invoice = "Invoice",
    Income = "Income",
    Language = "Language",
    Organization = "Organization",
    OrganizationContact = "OrganizationContact",
    OrganizationDepartment = "OrganizationDepartment",
    OrganizationDocument = "OrganizationDocument",
    OrganizationProject = "OrganizationProject",
    OrganizationTeam = "OrganizationTeam",
    OrganizationProjectModule = "OrganizationProjectModule",
    OrganizationSprint = "OrganizationSprint",
    OrganizationVendor = "OrganizationVendor",
    ResourceLink = "ResourceLink",
    ScreeningTask = "ScreeningTask",
    OrganizationStrategicInitiative = "OrganizationStrategicInitiative",
    Task = "Task",
    TaskLinkedIssue = "TaskLinkedIssue",
    TaskView = "TaskView",
    User = "User",
    Tenant = "Tenant"
}
