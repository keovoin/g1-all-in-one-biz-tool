/**
 * DTO for configuring Plane integration with tenant-specific URLs.
 */
export declare class ConfigurePlaneIntegrationDto {
    readonly mode?: 'shared' | 'custom';
    readonly planeWebUrl: string;
    readonly planeAdminUrl?: string;
    readonly planeSpaceUrl?: string;
}
