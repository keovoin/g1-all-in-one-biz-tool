import { DeleteResult } from 'typeorm';
import { Knex as KnexConnection } from 'knex';
import { IOrganization, IPagination, ITaskVersion, ITaskVersionCreateInput, ITaskVersionFindInput, ITenant } from '@gauzy/contracts';
import { TaskMetadataService } from '../task-metadata.service';
import { TaskVersion } from './version.entity';
import { MikroOrmTaskVersionRepository } from './repository/mikro-orm-task-version.repository';
import { TypeOrmTaskVersionRepository } from './repository/type-orm-task-version.repository';
export declare class TaskVersionService extends TaskMetadataService<TaskVersion> {
    readonly typeOrmTaskVersionRepository: TypeOrmTaskVersionRepository;
    readonly mikroOrmTaskVersionRepository: MikroOrmTaskVersionRepository;
    readonly knexConnection: KnexConnection;
    constructor(typeOrmTaskVersionRepository: TypeOrmTaskVersionRepository, mikroOrmTaskVersionRepository: MikroOrmTaskVersionRepository, knexConnection: KnexConnection);
    /**
     * GET versions by filters
     * If parameters not match, retrieve global versions
     *
     * @param params
     * @returns
     */
    fetchAll(params: ITaskVersionFindInput): Promise<IPagination<TaskVersion>>;
    /**
     * Few Versions can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    delete(id: ITaskVersion['id']): Promise<DeleteResult>;
    /**
     * Creates default task versions for multiple tenants.
     *
     * @param tenants Array of tenants for which task versions should be created.
     * @returns Promise resolving to an array of created task versions.
     */
    bulkCreateTenantsVersions(tenants: ITenant[]): Promise<TaskVersion[]>;
    /**
     * Creates default task versions for a specific organization.
     *
     * @param organization The organization for which task versions will be created.
     * @returns A promise that resolves to an array of created task versions.
     */
    bulkCreateOrganizationVersions(organization: IOrganization): Promise<ITaskVersion[] & TaskVersion[]>;
    /**
     * Creates bulk task versions for a specific organization entity.
     *
     * @param entity Base entity input to use as a template for each version.
     * @returns A promise that resolves to an array of created task versions.
     */
    createBulkVersionsByEntity(entity: Partial<ITaskVersionCreateInput>): Promise<ITaskVersion[]>;
}
