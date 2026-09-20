import { IResourceLinkCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { ResourceLink } from '../resource-link.entity';
declare const CreateResourceLinkDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & ResourceLink>;
/**
 * Create ResourceLink data validation request DTO
 */
export declare class CreateResourceLinkDTO extends CreateResourceLinkDTO_base implements IResourceLinkCreateInput {
}
export {};
