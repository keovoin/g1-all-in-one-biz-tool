import { DeleteResult } from 'typeorm';
import { IHelpCenterAuthor } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { HelpCenterAuthor } from './help-center-author.entity';
import { TypeOrmHelpCenterAuthorRepository } from './repository/type-orm-help-center-author.repository';
import { MikroOrmHelpCenterAuthorRepository } from './repository/mikro-orm-help-center-author.repository';
export declare class HelpCenterAuthorService extends TenantAwareCrudService<HelpCenterAuthor> {
    constructor(typeOrmHelpCenterAuthorRepository: TypeOrmHelpCenterAuthorRepository, mikroOrmHelpCenterAuthorRepository: MikroOrmHelpCenterAuthorRepository);
    /**
     * Get authors by article ID.
     *
     * @param articleId - The ID of the article to filter authors by.
     * @returns A promise that resolves to an array of help center authors for the article.
     */
    findByArticleId(articleId: string): Promise<HelpCenterAuthor[]>;
    /**
     * Create authors in Bulk
     *
     * @param input
     * @returns
     */
    createBulk(input: IHelpCenterAuthor[]): Promise<HelpCenterAuthor[]>;
    /**
     * Delete authors by IDs in Bulk
     *
     * @param ids
     * @returns
     */
    deleteBulk(ids: string[]): Promise<DeleteResult>;
    /**
     * Get all authors with optional filters and relations.
     *
     * @param options - Find options to customize the query (e.g., relations, order).
     * @returns A promise that resolves to an array of help center authors.
     */
    getAll(options?: any): Promise<IHelpCenterAuthor[]>;
}
