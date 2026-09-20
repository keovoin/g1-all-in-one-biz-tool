import { IResourceLinkUpdateInput } from '@gauzy/contracts';
import { CreateResourceLinkDTO } from './create-resource-link.dto';
declare const UpdateResourceLinkDTO_base: import("@nestjs/common").Type<Partial<CreateResourceLinkDTO>>;
/**
 * Create ResourceLink data validation request DTO
 */
export declare class UpdateResourceLinkDTO extends UpdateResourceLinkDTO_base implements IResourceLinkUpdateInput {
}
export {};
