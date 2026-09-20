import { UpdateResult } from 'typeorm';
import { IResourceLink, IResourceLinkCreateInput, IResourceLinkUpdateInput, ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud/tenant-aware-crud.service';
import { EmployeeService } from '../employee/employee.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ResourceLink } from './resource-link.entity';
import { TypeOrmResourceLinkRepository } from './repository/type-orm-resource-link.repository';
import { MikroOrmResourceLinkRepository } from './repository/mikro-orm-resource-link.repository';
export declare class ResourceLinkService extends TenantAwareCrudService<ResourceLink> {
    readonly typeOrmResourceLinkRepository: TypeOrmResourceLinkRepository;
    readonly mikroOrmResourceLinkRepository: MikroOrmResourceLinkRepository;
    private readonly _employeeService;
    private readonly _activityLogService;
    constructor(typeOrmResourceLinkRepository: TypeOrmResourceLinkRepository, mikroOrmResourceLinkRepository: MikroOrmResourceLinkRepository, _employeeService: EmployeeService, _activityLogService: ActivityLogService);
    /**
     * @description Create a new Resource Link
     * @param {IResourceLinkCreateInput} input - The data required to create a resource link.
     * @returns A promise that resolves to the created resource link entity.
     * @memberof ResourceLinkService
     */
    create(input: IResourceLinkCreateInput): Promise<IResourceLink>;
    /**
     * @description Update an existing Resource Link
     * @param {ID} id - The ID of the resource link to update.
     * @param {IResourceLinkUpdateInput} input - The data to update the resource link.
     * @returns A promise that resolves to the updated resource link entity, or an update result.
     * @memberof ResourceLinkService
     */
    update(id: ID, input: IResourceLinkUpdateInput): Promise<IResourceLink | UpdateResult>;
}
