import { IEntitySubscriptionCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core';
import { EntitySubscription } from '../entity-subscription.entity';
declare const CreateEntitySubscriptionDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<EntitySubscription, "type" | "entity" | "entityId" | "actorType">>;
/**
 * Create entity subscription data validation request DTO.
 */
export declare class CreateEntitySubscriptionDTO extends CreateEntitySubscriptionDTO_base implements IEntitySubscriptionCreateInput {
}
export {};
