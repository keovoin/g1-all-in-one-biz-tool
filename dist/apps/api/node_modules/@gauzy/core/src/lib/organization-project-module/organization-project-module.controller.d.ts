import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IOrganizationProjectModule, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { OrganizationProjectModule } from './organization-project-module.entity';
import { OrganizationProjectModuleService } from './organization-project-module.service';
import { CreateOrganizationProjectModuleDTO, OrganizationProjectModuleFindInputDTO, UpdateOrganizationProjectModuleDTO } from './dto';
export declare class OrganizationProjectModuleController extends CrudController<OrganizationProjectModule> {
    private readonly organizationProjectModuleService;
    private readonly commandBus;
    constructor(organizationProjectModuleService: OrganizationProjectModuleService, commandBus: CommandBus);
    /**
     * @description Find employee project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleController
     */
    getEmployeeProjectModules(params: BaseQueryDTO<OrganizationProjectModule>): Promise<IPagination<IOrganizationProjectModule>>;
    /**
     * @description Find Team's project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleController
     */
    findTeamProjectModules(params: BaseQueryDTO<OrganizationProjectModule>): Promise<IPagination<IOrganizationProjectModule>>;
    /**
     * @description Find project modules by employee
     * @param employeeId - The employee ID for whom to search project modules
     * @param options - Finders options
     * @returns A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleController
     */
    findByEmployee(employeeId: ID, params: OrganizationProjectModuleFindInputDTO): Promise<IPagination<IOrganizationProjectModule>>;
    findAll(params: BaseQueryDTO<OrganizationProjectModule>): Promise<IPagination<IOrganizationProjectModule>>;
    findById(id: ID, params: BaseQueryDTO<OrganizationProjectModule>): Promise<OrganizationProjectModule>;
    create(entity: CreateOrganizationProjectModuleDTO): Promise<IOrganizationProjectModule>;
    update(id: ID, entity: UpdateOrganizationProjectModuleDTO): Promise<IOrganizationProjectModule | UpdateResult>;
    delete(id: ID): Promise<DeleteResult>;
}
