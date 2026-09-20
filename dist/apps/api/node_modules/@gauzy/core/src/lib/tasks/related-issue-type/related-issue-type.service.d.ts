import { DeleteResult } from 'typeorm';
import { Knex as KnexConnection } from 'knex';
import { IOrganization, IPagination, ITaskRelatedIssueType, ITaskRelatedIssueTypeCreateInput, ITaskRelatedIssueTypeFindInput } from '@gauzy/contracts';
import { TaskMetadataService } from '../task-metadata.service';
import { TaskRelatedIssueType } from './related-issue-type.entity';
import { TypeOrmTaskRelatedIssueTypeRepository } from './repository/type-orm-related-issue-type.repository';
import { MikroOrmTaskRelatedIssueTypeRepository } from './repository/mikro-orm-related-issue-type.repository';
export declare class TaskRelatedIssueTypeService extends TaskMetadataService<TaskRelatedIssueType> {
    readonly typeOrmTaskRelatedIssueTypeRepository: TypeOrmTaskRelatedIssueTypeRepository;
    readonly mikroOrmTaskRelatedIssueTypeRepository: MikroOrmTaskRelatedIssueTypeRepository;
    readonly knexConnection: KnexConnection;
    constructor(typeOrmTaskRelatedIssueTypeRepository: TypeOrmTaskRelatedIssueTypeRepository, mikroOrmTaskRelatedIssueTypeRepository: MikroOrmTaskRelatedIssueTypeRepository, knexConnection: KnexConnection);
    /**
     * GET statuses by filters
     * If parameters not match, retrieve global statuses
     *
     * @param params
     * @returns
     */
    fetchAll(params: ITaskRelatedIssueTypeFindInput): Promise<IPagination<TaskRelatedIssueType>>;
    /**
     * Few RelatedIssueTypes can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    delete(id: ITaskRelatedIssueType['id']): Promise<DeleteResult>;
    /**
     * Create bulk related issue types for a specific organization.
     *
     * This method retrieves issue types for the tenant and creates
     * organization-specific related issue types from them.
     *
     * @param organization The organization for which related issue types will be created.
     * @returns Promise resolving to created related issue types.
     */
    bulkCreateOrganizationRelatedIssueTypes(organization: IOrganization): Promise<ITaskRelatedIssueType[]>;
    /**
     * Create bulk related issue types for a specific organization entity.
     *
     * @param entity Base entity input to use as a template for each related issue type.
     * @returns A promise that resolves to an array of created related issue types.
     */
    createBulkRelatedIssueTypesByEntity(entity: Partial<ITaskRelatedIssueTypeCreateInput>): Promise<ITaskRelatedIssueType[]>;
}
