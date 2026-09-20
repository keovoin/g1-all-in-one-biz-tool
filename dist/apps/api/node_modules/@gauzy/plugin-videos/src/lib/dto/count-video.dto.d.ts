/**
 * Entity Count Video DTO
 *
 * Represents the DTO for counting videos within a specific tenant and organization,
 * optionally filtered by a date range.
 */
export declare class CountVideoDTO {
    /**
     * The ID of the tenant.
     *
     * @example 'd3b07384-d9a0-4d5f-bf6d-f1b5b71e9a37'
     */
    tenantId: string;
    /**
     * The ID of the organization within the tenant.
     *
     * @example 'a9e3fbc9-d0b7-4e85-b6f2-2eaf3a5d72dc'
     */
    organizationId: string;
    /**
     * The start date for filtering video records.
     * Can be provided as a string or a Date object.
     *
     * @example '2023-01-01T00:00:00.000Z'
     */
    startDate: Date | string;
    /**
     * The end date for filtering video records.
     * Can be provided as a string or a Date object.
     *
     * @example '2023-12-31T23:59:59.999Z'
     */
    endDate: Date | string;
}
