import { Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Knex as KnexConnection } from 'knex';
import { IIssueType, IIssueTypeCreateInput, IIssueTypeFindInput, IIssueTypeUpdateInput, IOrganization, IPagination, ITenant } from '@gauzy/contracts';
import { IssueType } from './issue-type.entity';
import { TaskMetadataService } from './../task-metadata.service';
import { MikroOrmIssueTypeRepository } from './repository/mikro-orm-issue-type.repository';
import { TypeOrmIssueTypeRepository } from './repository/type-orm-issue-type.repository';
export declare class IssueTypeService extends TaskMetadataService<IssueType> {
    readonly typeOrmIssueTypeRepository: TypeOrmIssueTypeRepository;
    readonly mikroOrmIssueTypeRepository: MikroOrmIssueTypeRepository;
    readonly knexConnection: KnexConnection;
    readonly logger: Logger;
    constructor(typeOrmIssueTypeRepository: TypeOrmIssueTypeRepository, mikroOrmIssueTypeRepository: MikroOrmIssueTypeRepository, knexConnection: KnexConnection);
    /**
     * Few issue types can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    delete(id: IIssueType['id']): Promise<DeleteResult>;
    /**
     * Fetches issue types based on specified parameters.
     *
     * @param params - Parameters for finding issue types (IIssueTypeFindInput).
     * @returns The matching issue types, or system defaults when the requested scope has none.
     */
    fetchAll(params: IIssueTypeFindInput): Promise<IPagination<IIssueType>>;
    /**
     * Build a MikroORM-compatible filter object from IIssueTypeFindInput params.
     */
    private buildIssueTypeFilter;
    /**
     * Create issue types for a list of tenants using DEFAULT_GLOBAL_ISSUE_TYPES.
     *
     * @param tenants The list of tenants.
     * @returns A promise resolving to an array of created issue types.
     */
    bulkCreateTenantsIssueTypes(tenants: ITenant[]): Promise<IIssueType[]>;
    /**
     * Create bulk issue types for organization
     *
     * @param organization
     */
    bulkCreateOrganizationIssueType(organization: IOrganization): Promise<IIssueType[]>;
    /**
     * Create bulk issue types for a specific organization entity.
     *
     * @param entity - Partial input for creating issue types (Partial<IIssueTypeCreateInput>).
     * @returns A Promise resolving to an array of created issue types (IIssueType[]).
     * @throws HttpException if an error occurs during the creation process.
     */
    createBulkIssueTypeByEntity(entity: Partial<IIssueTypeCreateInput>): Promise<IIssueType[]>;
    /**
     * Marks an issue type as default and updates other issue types accordingly.
     *
     * @param id The ID of the issue type to mark as default.
     * @param input An object containing input parameters, including organization, team, and project IDs.
     * @returns A Promise that resolves to an array of updated issue types.
     */
    markAsDefault(id: IIssueType['id'], input: IIssueTypeUpdateInput): Promise<IIssueType[]>;
}
