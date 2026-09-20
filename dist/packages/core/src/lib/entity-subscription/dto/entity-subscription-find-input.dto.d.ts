import { IEntitySubscriptionFindInput } from '@gauzy/contracts';
import { EntitySubscription } from '../entity-subscription.entity';
import { TenantOrganizationBaseDTO } from '../../core/dto';
declare const EntitySubscriptionFindInputDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Partial<EntitySubscription>>;
/**
 * Entity subscription find input DTO validation
 */
export declare class EntitySubscriptionFindInputDTO extends EntitySubscriptionFindInputDTO_base implements IEntitySubscriptionFindInput {
}
export {};
