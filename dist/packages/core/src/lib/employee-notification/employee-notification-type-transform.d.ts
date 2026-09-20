import { ValueTransformer } from 'typeorm';
import { EmployeeNotificationTypeEnum } from '@gauzy/contracts';
/**
 * EmployeeNotificationTypeTransformer handles the conversion between the enum string values
 * (used in the application) and the integer values (stored in the database).
 */
export declare class EmployeeNotificationTypeTransformer implements ValueTransformer {
    /**
     * Converts the enum string value to its integer representation when writing to the database.
     *
     * @param value - The `EmployeeNotificationTypeEnum` value.
     * @returns The corresponding integer value to be stored in the database.
     */
    to(value: EmployeeNotificationTypeEnum): number;
    /**
     * Converts the integer value to its corresponding `EmployeeNotificationTypeEnum` string when reading from the database.
     *
     * @param value - The integer value from the database.
     * @returns The corresponding `EmployeeNotificationTypeEnum`.
     */
    from(value: number): EmployeeNotificationTypeEnum;
}
