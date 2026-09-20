import { BaseEntityEnum, IBasePerEntityType, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../entities/internal';
export declare abstract class BasePerEntityType extends TenantOrganizationBaseEntity implements IBasePerEntityType {
    /**
     * The type of entity type record from which notification was created
     */
    entity: BaseEntityEnum;
    /**
     * The ID of entity record from which notification was created
     */
    entityId: ID;
}
