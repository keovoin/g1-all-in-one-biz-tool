import { IRolePermission } from '@gauzy/contracts';
import { Role, TenantBaseEntity } from '../core/entities/internal';
export declare class RolePermission extends TenantBaseEntity implements IRolePermission {
    permission: string;
    enabled: boolean;
    description: string;
    role: Role;
    roleId: string;
}
