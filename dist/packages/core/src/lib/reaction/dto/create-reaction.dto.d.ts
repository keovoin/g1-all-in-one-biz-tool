import { IReactionCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { Reaction } from '../reaction.entity';
declare const CreateReactionDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<Reaction, "entity" | "entityId" | "emoji">>;
/**
 * Create Reaction data validation request DTO.
 *
 * This DTO combines:
 * - TenantOrganizationBaseDTO: provides tenant and organization-related properties.
 * - A selection of properties from Reaction (entity, entityId, and emoji).
 *
 * The resulting class implements IReactionCreateInput.
 */
export declare class CreateReactionDTO extends CreateReactionDTO_base implements IReactionCreateInput {
}
export {};
