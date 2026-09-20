import { ValueTransformer } from 'typeorm';
import { AvailabilityStatusEnum } from '@gauzy/contracts';
/**
 * Transformer to handle the conversion between the enum values
 * (used in the application) and integer values (stored in the database).
 */
export declare class AvailabilityStatusTransformer implements ValueTransformer {
    /**
     * Converts the enum value to its corresponding integer representation
     * when saving to the database.
     *
     * @param value - The `AvailabilityStatusEnum` value.
     * @returns The corresponding integer value for storage in the database.
     */
    to(value: AvailabilityStatusEnum): number;
    /**
     * Converts the integer value from the database back to the corresponding
     * enum value when reading.
     *
     * @param value - The integer value stored in the database.
     * @returns The corresponding `AvailabilityStatusEnum` value.
     */
    from(value: number): AvailabilityStatusEnum;
}
