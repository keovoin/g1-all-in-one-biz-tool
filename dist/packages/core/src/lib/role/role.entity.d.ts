import { IRolePermission, IRole } from '@gauzy/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
export declare class Role extends TenantBaseEntity implements IRole {
    name: string;
    isSystem?: boolean;
    /**
     * Role Permissions
     */
    rolePermissions?: IRolePermission[];
}
