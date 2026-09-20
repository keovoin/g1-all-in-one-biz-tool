import { Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Knex as KnexConnection } from 'knex';
import { ID, IOrganization, IPagination, ITaskSize, ITaskSizeCreateInput, ITaskSizeFindInput, ITenant } from '@gauzy/contracts';
import { TaskMetadataService } from '../task-metadata.service';
import { TaskSize } from './size.entity';
import { TypeOrmTaskSizeRepository } from './repository/type-orm-task-size.repository';
import { MikroOrmTaskSizeRepository } from './repository/mikro-orm-task-size.repository';
export declare class TaskSizeService extends TaskMetadataService<TaskSize> {
    readonly typeOrmTaskSizeRepository: TypeOrmTaskSizeRepository;
    readonly mikroOrmTaskSizeRepository: MikroOrmTaskSizeRepository;
    readonly knexConnection: KnexConnection;
    readonly logger: Logger;
    constructor(typeOrmTaskSizeRepository: TypeOrmTaskSizeRepository, mikroOrmTaskSizeRepository: MikroOrmTaskSizeRepository, knexConnection: KnexConnection);
    /**
     * Few task sizes can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * Find task sizes based on the provided parameters.
     *
     * @param params - The input parameters for the task size search.
     * @returns A promise resolving to the paginated list of task sizes.
     */
    fetchAll(params: ITaskSizeFindInput): Promise<IPagination<ITaskSize>>;
    /**
     * Create bulk task sizes for tenants.
     * Uses saveManyWithoutEnrichment to preserve each entity's specific tenantId.
     *
     * @param tenants
     */
    bulkCreateTenantsTaskSizes(tenants: ITenant[]): Promise<ITaskSize[]>;
    /**
     * Create bulk task sizes for organization.
     *
     * @param organization
     */
    bulkCreateOrganizationTaskSizes(organization: IOrganization): Promise<ITaskSize[]>;
    /**
     * Create bulk task sizes for specific organization entity.
     *
     * @param entity
     * @returns
     */
    createBulkSizesByEntity(entity: Partial<ITaskSizeCreateInput>): Promise<ITaskSize[]>;
}
