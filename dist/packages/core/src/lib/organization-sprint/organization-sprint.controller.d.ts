import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IOrganizationSprint, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { OrganizationSprint } from './organization-sprint.entity';
import { OrganizationSprintService } from './organization-sprint.service';
import { CreateOrganizationSprintDTO, UpdateOrganizationSprintDTO } from './dto';
export declare class OrganizationSprintController extends CrudController<OrganizationSprint> {
    private readonly organizationSprintService;
    private readonly commandBus;
    constructor(organizationSprintService: OrganizationSprintService, commandBus: CommandBus);
    findAll(data: any): Promise<IPagination<IOrganizationSprint>>;
    findById(id: ID, params: BaseQueryDTO<OrganizationSprint>): Promise<IOrganizationSprint>;
    /**
     * CREATE organization sprint
     *
     * @param entity
     * @param options
     * @returns
     */
    create(entity: CreateOrganizationSprintDTO): Promise<IOrganizationSprint>;
    /**
     * UPDATE organization sprint by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateOrganizationSprintDTO): Promise<IOrganizationSprint>;
    delete(id: ID): Promise<DeleteResult>;
}
