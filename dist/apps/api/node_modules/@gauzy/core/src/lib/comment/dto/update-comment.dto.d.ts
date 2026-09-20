import { ICommentUpdateInput } from '@gauzy/contracts';
import { CreateCommentDTO } from './create-comment.dto';
declare const UpdateCommentDTO_base: import("@nestjs/common").Type<Partial<Omit<CreateCommentDTO, "entity" | "entityId">>>;
/**
 * Update Comment data validation request DTO
 */
export declare class UpdateCommentDTO extends UpdateCommentDTO_base implements ICommentUpdateInput {
}
export {};
