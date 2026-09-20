import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IEmployee, IResourceLink, IURLMetaData } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmResourceLinkRepository } from './repository/mikro-orm-resource-link.repository';
export declare class ResourceLink extends BasePerEntityType implements IResourceLink {
    [EntityRepositoryType]?: MikroOrmResourceLinkRepository;
    /**
     * The title of the resource link.
     * This property holds a brief and descriptive title representing the resource.
     */
    title: string;
    /**
     * The URL of the resource.
     * This property stores the link to the resource associated with the entry.
     */
    url: string;
    /**
     * Metadata associated with the resource.
     * This property stores additional data that can vary in type depending on the database.
     * For SQLite, it's stored as a text string, otherwise as a JSON object.
     */
    metaData?: string | IURLMetaData;
    /**
     * Resource Link Author (Employee).
     */
    employee?: IEmployee;
    /**
     * Resource Link Author ID.
     */
    employeeId?: ID;
}
