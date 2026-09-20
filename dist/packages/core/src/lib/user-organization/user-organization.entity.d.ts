import { ID, IUser, IUserOrganization } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class UserOrganization extends TenantOrganizationBaseEntity implements IUserOrganization {
    isDefault: boolean;
    /**
     * User
     */
    user?: IUser;
    userId?: ID;
}
