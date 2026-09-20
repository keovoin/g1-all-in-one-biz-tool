import { IReactionUpdateInput } from '@gauzy/contracts';
import { Reaction } from '../reaction.entity';
import { TenantOrganizationBaseDTO } from '../../core/dto';
declare const UpdateReactionDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<Reaction, "emoji">>;
/**
 * Update Reaction data validation request DTO
 */
export declare class UpdateReactionDTO extends UpdateReactionDTO_base implements IReactionUpdateInput {
}
export {};
