import { ITag, ITagType } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { Taggable } from '../tags/tag.types';
export declare class TagType extends TenantOrganizationBaseEntity implements ITagType, Taggable {
    type: string;
    /**
     * A collection of tags associated with the tag type.
     */
    tags?: ITag[];
}
