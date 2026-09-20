import { Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Knex as KnexConnection } from 'knex';
import { ID, IOrganization, IPagination, IReorderDTO, ITaskStatus, ITaskStatusCreateInput, ITaskStatusFindInput, ITaskStatusUpdateInput, ITenant } from '@gauzy/contracts';
import { IPartialEntity } from '../../core/crud/icrud.service';
import { TaskMetadataService } from '../task-metadata.service';
import { TaskStatus } from './status.entity';
import { TypeOrmTaskStatusRepository } from './repository/type-orm-task-status.repository';
import { MikroOrmTaskStatusRepository } from './repository/mikro-orm-task-status.repository';
export declare class TaskStatusService extends TaskMetadataService<TaskStatus> {
    readonly typeOrmTaskStatusRepository: TypeOrmTaskStatusRepository;
    readonly mikroOrmTaskStatusRepository: MikroOrmTaskStatusRepository;
    readonly knexConnection: KnexConnection;
    readonly logger: Logger;
    constructor(typeOrmTaskStatusRepository: TypeOrmTaskStatusRepository, mikroOrmTaskStatusRepository: MikroOrmTaskStatusRepository, knexConnection: KnexConnection);
    /**
     * Create task status
     *
     * @param entity - object that contains the input values and template to be used
     * @returns - a promise that resolves after task status created
     */
    create(entity: IPartialEntity<TaskStatus>): Promise<ITaskStatus>;
    /**
     * GET statuses by filters
     * If parameters not match, retrieve global statuses
     *
     * @param params
     * @returns
     */
    fetchAll(params: ITaskStatusFindInput): Promise<IPagination<TaskStatus>>;
    /**
     * Few Statuses can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * Creates default task statuses for multiple tenants.
     *
     * This method generates a Cartesian product between the provided tenants
     * and the DEFAULT_GLOBAL_STATUSES, creating system-independent task statuses
     * for each tenant.
     *
     * @param tenants Array of tenants for which task statuses should be created
     * @returns Promise resolving to an array of created task statuses
     */
    bulkCreateTenantsStatus(tenants: ITenant[]): Promise<TaskStatus[]>;
    /**
     * Creates bulk task statuses for a specific organization.
     *
     * @param organization The organization for which the task statuses will be created.
     * @returns A promise that resolves to an array of created task statuses.
     */
    bulkCreateOrganizationStatus(organization: IOrganization): Promise<ITaskStatus[] & TaskStatus[]>;
    /**
     * Creates bulk task statuses based on the properties of a given entity.
     *
     * @param entity A partial representation of the entity from which properties will be extracted for creating task statuses.
     * @returns A promise that resolves to an array of created task statuses.
     */
    createBulkStatusesByEntity(entity: Partial<ITaskStatusCreateInput>): Promise<ITaskStatus[]>;
    /**
     * Reorders a list of items based on the given ReorderDTO array.
     * @param list - An array of ReorderDTO representing the IDs and their new orders.
     * @returns An object indicating success or failure, along with the updated list.
     * @throws BadRequestException if an error occurs during reordering.
     */
    reorder(list: IReorderDTO[]): Promise<{
        success: boolean;
        list?: IReorderDTO[];
    }>;
    /**
     * Marks an task status as default and updates other task statuses accordingly.
     *
     * @param id The ID of the task status to mark as default.
     * @param input An object containing input parameters, including organization, team, and project IDs.
     * @returns A Promise that resolves to an array of updated task statuses.
     */
    markAsDefault(id: ID, input: ITaskStatusUpdateInput): Promise<ITaskStatus[]>;
}
