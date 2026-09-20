import { IOrganizationContact, ContactOrganizationInviteStatus, ContactType, ITag, IContact, IOrganizationProject, IInvoice, IEmployee, IPayment, OrganizationContactBudgetTypeEnum, IExpense, ITimeLog, IIncome, IImageAsset, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationContact extends TenantOrganizationBaseEntity implements IOrganizationContact {
    /**
     * Represents the name of the organization contact.
     */
    name: string;
    /**
     * Represents the primary email of the organization contact.
     */
    primaryEmail: string;
    /**
     * Represents the primary phone of the organization contact.
     */
    primaryPhone: string;
    /**
     * Represents the invite status of the organization contact.
     */
    inviteStatus?: ContactOrganizationInviteStatus;
    /**
     * Represents the notes of the organization contact.
     */
    notes?: string;
    /**
     * Represents the contact type of the organization contact.
     */
    contactType: ContactType;
    /**
     * Represents the image URL of the organization contact.
     */
    imageUrl?: string;
    /**
     * Represents the budget of the organization contact.
     */
    budget?: number;
    /**
     * Represents the budget type of the organization contact.
     */
    budgetType?: OrganizationContactBudgetTypeEnum;
    /**
     * Represents the contact of the organization contact.
     */
    contact?: IContact;
    /**
     * Represents the ID of the contact of the organization contact.
     */
    contactId?: ID;
    /**
     * Represents the image of the organization contact.
     */
    image?: IImageAsset;
    /**
     * Represents the ID of the image of the organization contact.
     */
    imageId?: ID;
    /**
     * Organization Projects Relationship
     */
    projects?: IOrganizationProject[];
    /**
     *  Invoices Relationship
     */
    invoices?: IInvoice[];
    /**
     * Organization Payments Relationship
     */
    payments?: IPayment[];
    /**
     * Organization Expenses Relationship
     */
    expenses?: IExpense[];
    /**
     * Organization Incomes Relationship
     */
    incomes?: IIncome[];
    /**
     * Time Logs Relationship
     */
    timeLogs?: ITimeLog[];
    /**
     * Organization Contact Tags
     */
    tags?: ITag[];
    /**
     * Organization Contact Employees
     */
    members?: IEmployee[];
}
