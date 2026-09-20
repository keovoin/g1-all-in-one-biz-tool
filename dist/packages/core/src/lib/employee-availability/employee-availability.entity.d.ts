import { AvailabilityStatusEnum, ID, IEmployee, IEmployeeAvailability } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmployeeAvailability extends TenantOrganizationBaseEntity implements IEmployeeAvailability {
    /**
     * Represents the start date of an employee's availability period.
     * This marks when the availability status takes effect.
     */
    startDate: Date;
    /**
     * Represents the end date of an employee's availability period.
     * This marks when the availability status expires.
     */
    endDate: Date;
    /**
     * The day of the week corresponding to the availability.
     * Values range from `0` (Sunday) to `6` (Saturday).
     */
    dayOfWeek: number;
    /**
     * The availability status of the employee.
     * Uses `AvailabilityStatusEnum` to define the available states.
     */
    availabilityStatus: AvailabilityStatusEnum;
    /**
     * Optional notes providing additional details about the availability.
     * Example: "Available until 2 PM" or "Remote work only."
     */
    availabilityNotes?: string;
    /**
     * Reference to the Employee associated with this availability record.
     * Establishes a many-to-one relationship, meaning multiple availability records
     * can be linked to a single employee.
     */
    employee: IEmployee;
    /**
     * The UUID representing the linked `Employee` record.
     * This serves as the foreign key that connects the availability record to a specific employee.
     */
    employeeId: ID;
}
