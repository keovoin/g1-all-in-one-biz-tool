import { FindOptionsRelations, SelectQueryBuilder } from 'typeorm';
import { IPagination, ITag, ITagFindInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../core/crud';
import { Tag } from './tag.entity';
import { MikroOrmTagRepository } from './repository/mikro-orm-tag.repository';
import { TypeOrmTagRepository } from './repository/type-orm-tag.repository';
export declare class TagService extends TenantAwareCrudService<Tag> {
    constructor(typeOrmTagRepository: TypeOrmTagRepository, mikroOrmTagRepository: MikroOrmTagRepository);
    /**
     * GET tags by tenant or organization level
     *
     * @param input - Filter criteria for finding tags.
     * @param relations - Optional relations to include in the query.
     * @returns A pagination object containing the filtered tags and total count.
     */
    findTagsByLevel(input: ITagFindInput, relations?: string[]): Promise<IPagination<ITag>>;
    /**
     * GET tenant/organization level tags
     *
     * @param input
     * @param relations
     * @returns
     */
    findTags(input: ITagFindInput, relations?: string[] | FindOptionsRelations<Tag>): Promise<IPagination<ITag>>;
    /**
     * Builds a query to filter tags based on provided criteria.
     *
     * @param query - The query builder instance for the Tag entity.
     * @param request - The input criteria for filtering tags.
     * @returns The modified query builder instance.
     */
    getFilterTagQuery(query: SelectQueryBuilder<Tag>, request: ITagFindInput): SelectQueryBuilder<Tag>;
}
