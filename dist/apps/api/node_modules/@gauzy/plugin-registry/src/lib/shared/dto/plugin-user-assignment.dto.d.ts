/**
 * DTO for assigning users to a plugin
 */
export declare class AssignPluginUsersDTO {
    userIds: string[];
    reason?: string;
}
/**
 * DTO for unassigning users from a plugin
 */
export declare class UnassignPluginUsersDTO {
    userIds: string[];
    reason?: string;
}
/**
 * DTO for checking plugin user access
 */
export declare class CheckPluginUserAccessDTO {
    pluginId: string;
    userId?: string;
}
/**
 * Response DTO for plugin user access check
 */
export declare class PluginUserAccessResponseDTO {
    hasAccess: boolean;
    accessLevel?: string;
    assignment?: any;
}
