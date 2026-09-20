/**
 * Make.com API response and request interfaces.
 *
 * These model the Make.com REST API v2 resources that Gauzy interacts with.
 * @see https://developers.make.com/api-documentation/api-reference
 */
export interface IMakeComPaginationParams {
    /** Number of records to skip */
    'pg[offset]'?: number;
    /** Max results per page */
    'pg[limit]'?: number;
    /** Field to sort on */
    'pg[sortBy]'?: string;
    /** Sort direction */
    'pg[sortDir]'?: 'asc' | 'desc';
}
export interface IMakeComPaginatedResponse<T> {
    [key: string]: T[] | IMakeComPagination;
    pg: IMakeComPagination;
}
export interface IMakeComPagination {
    offset: number;
    limit: number;
    sortBy: string;
    sortDir: string;
}
export interface IMakeComOrganization {
    id: number;
    name: string;
    countryId?: number;
    timezoneId?: number;
    license?: string;
    zone?: string;
}
export interface IMakeComTeam {
    id: number;
    name: string;
    organizationId: number;
}
export interface IMakeComConnection {
    id: number;
    name: string;
    accountName?: string;
    accountLabel?: string;
    accountType?: string;
    packageName?: string;
    expire?: string;
    metadata?: Record<string, any>;
    teamId?: number;
    upgradeable?: boolean;
    scoped?: boolean;
    accountTheme?: string;
    editable?: boolean;
}
export interface IMakeComScenario {
    id: number;
    name: string;
    teamId: number;
    hookId?: number;
    deviceId?: number;
    deviceScope?: string;
    description?: string;
    folderId?: number;
    isEnabled?: boolean;
    isPaused?: boolean;
    usedPackages?: string[];
    lastEdit?: string;
    scheduling?: IMakeComScenarioScheduling;
    islinked?: boolean;
    isinvalid?: boolean;
    islocked?: boolean;
    createdByUser?: {
        id: number;
        name: string;
        email: string;
    };
    updatedByUser?: {
        id: number;
        name: string;
        email: string;
    };
}
export interface IMakeComScenarioScheduling {
    type: string;
    interval?: number;
}
export interface IMakeComCreateScenarioParams {
    teamId: number;
    name: string;
    blueprint: string;
    scheduling: IMakeComScenarioScheduling;
    folderId?: number;
}
export interface IMakeComUpdateScenarioParams {
    name?: string;
    blueprint?: string;
    scheduling?: IMakeComScenarioScheduling;
}
export interface IMakeComHook {
    id: number;
    name: string;
    teamId: number;
    url?: string;
    type?: string;
    typeName?: string;
    packageName?: string;
    theme?: string;
    enabled?: boolean;
    data?: Record<string, any>;
    queueCount?: number;
    queueLimit?: number;
}
export interface IMakeComCreateHookParams {
    teamId: number;
    name: string;
    typeName: string;
    /** Connection-related parameters */
    [key: string]: any;
}
export interface IMakeComTemplate {
    id: number;
    name: string;
    description?: string;
    usedPackages?: string[];
    public?: boolean;
    publishedDate?: string;
    teamId?: number;
}
export interface IMakeComUser {
    id: number;
    name: string;
    email: string;
    language?: string;
    locale?: string;
    timezoneId?: number;
    countryId?: number;
}
export interface IMakeComApiError {
    message: string;
    code?: string;
    suberrors?: Array<{
        message: string;
        path: string;
    }>;
}
/**
 * Available Make.com zones.
 * The zone determines the API base URL (e.g., us2.make.com/api/v2).
 */
export type MakeComZone = 'eu1' | 'eu2' | 'us1' | 'us2';
export declare const MAKE_COM_ZONES: MakeComZone[];
/**
 * Builds the Make.com API base URL for a given zone.
 */
export declare function getMakeApiBaseUrl(zone: MakeComZone): string;
