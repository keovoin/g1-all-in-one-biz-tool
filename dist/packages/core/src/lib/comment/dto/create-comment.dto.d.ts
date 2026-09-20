import { ICommentCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { MentionEmployeeIdsDTO } from '../../mention/dto';
import { Comment } from '../comment.entity';
declare const CreateCommentDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & MentionEmployeeIdsDTO & Comment>;
/**
 * Create Comment data validation request DTO
 */
export declare class CreateCommentDTO extends CreateCommentDTO_base implements ICommentCreateInput {
    entityName?: string;
}
export {};
