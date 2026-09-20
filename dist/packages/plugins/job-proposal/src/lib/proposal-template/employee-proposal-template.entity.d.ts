import { ID, IEmployee, IEmployeeProposalTemplate } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class EmployeeProposalTemplate extends TenantOrganizationBaseEntity implements IEmployeeProposalTemplate {
    /**
     * The name/title of the proposal template (e.g., "General Proposal", "Technical Proposal").
     */
    name?: string;
    /**
     * The main content or body of the proposal template.
     * Marked as 'text' type, and set to nullable for optional usage.
     * Also, 'fulltext: true' enables full-text search if supported by the database.
     */
    content?: string;
    /**
     * Indicates if this template is the default template for the employee/tenant combination.
     * Defaults to 'false' when newly created.
     */
    isDefault?: boolean;
    /**
     * Many-to-one relationship linking this template to a specific employee.
     * If the employee is deleted, this template is deleted as well (cascade).
     */
    employee?: IEmployee;
    /**
     * Stores the UUID of the linked employee.
     * This is automatically populated via `@RelationId` from the `employee` relation.
     */
    employeeId?: ID;
}
