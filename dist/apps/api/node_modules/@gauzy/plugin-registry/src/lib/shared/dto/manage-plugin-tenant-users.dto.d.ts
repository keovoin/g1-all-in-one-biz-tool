/**
 * Operation type for managing plugin tenant users
 */
export declare enum PluginTenantUserOperationType {
    ALLOW = "allow",
    DENY = "deny",
    REMOVE_ALLOWED = "remove-allowed",
    REMOVE_DENIED = "remove-denied",
    UNASSIGN = "unassign"
}
/**
 * DTO for managing plugin tenant users (allow, deny, remove)
 */
export declare class ManagePluginTenantUsersDTO {
    userIds: string[];
    operation: PluginTenantUserOperationType;
    reason?: string;
}
/**
 * Query DTO for getting plugin tenant users
 */
export declare class GetPluginTenantUsersQueryDTO {
    type?: 'allowed' | 'denied' | 'all';
    skip?: number;
    take?: number;
    searchTerm?: string;
}
