import { ITagTypeCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { TagType } from '../tag-type.entity';
declare const CreateTagTypeDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<TagType, "type" | "tags">>;
/**
 * DTO for creating a Tag Type
 */
export declare class CreateTagTypeDTO extends CreateTagTypeDTO_base implements ITagTypeCreateInput {
}
export {};
