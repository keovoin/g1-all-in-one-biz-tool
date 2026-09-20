/**
 * DTO for assigning plugin subscription to users
 */
export declare class AssignPluginSubscriptionDTO {
    userIds: string[];
    reason?: string;
}
/**
 * DTO for revoking plugin subscription assignment from users
 */
export declare class RevokePluginSubscriptionAssignmentDTO {
    userIds: string[];
    revocationReason?: string;
}
/**
 * DTO for checking plugin subscription access
 */
export declare class CheckPluginSubscriptionAccessDTO {
    pluginId: string;
    userId?: string;
}
/**
 * Response DTO for subscription access check
 */
export declare class PluginSubscriptionAccessResponseDTO {
    hasAccess: boolean;
    accessLevel: string | null;
    canAssign: boolean;
    requiresSubscription: boolean;
    canActivate: boolean;
    subscription?: any;
}
