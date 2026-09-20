import { ITagTypeUpdateInput } from '@gauzy/contracts';
import { CreateTagTypeDTO } from './create-tag-type.dto';
declare const UpdateTagTypeDTO_base: import("@nestjs/common").Type<Partial<CreateTagTypeDTO>>;
/**
 * DTO for updating a Tag Type
 */
export declare class UpdateTagTypeDTO extends UpdateTagTypeDTO_base implements ITagTypeUpdateInput {
}
export {};
