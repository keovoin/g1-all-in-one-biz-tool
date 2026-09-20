import { CommandBus } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { ID, IOrganization, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, CrudController } from './../core/crud';
import { Organization } from './organization.entity';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDTO, UpdateOrganizationDTO } from './dto';
import { OrganizationFindOptionsQueryDTO } from './dto/organization-find-options.dto';
export declare class OrganizationController extends CrudController<Organization> {
    private readonly organizationService;
    private readonly commandBus;
    constructor(organizationService: OrganizationService, commandBus: CommandBus);
    /**
     * GET organization count
     *
     * @param options
     * @returns
     */
    getCount(options: FindOptionsWhere<Organization>): Promise<number>;
    /**
     * GET organization pagination
     *
     * Retrieve a paginated list of organizations within the tenant.
     *
     * @param options Query options for pagination and filtering
     * @returns Paginated list of organizations
     */
    pagination(options: BaseQueryDTO<Organization>): Promise<IPagination<IOrganization>>;
    /**
     * GET organizations by find many conditions
     *
     * Find all organizations within the tenant, optionally applying filters.
     *
     * @param options Query options for filtering organizations
     * @returns A list of organizations based on the applied filters
     */
    findAll(options: BaseQueryDTO<Organization>): Promise<IPagination<IOrganization>>;
    /**
     * GET organization by id
     *
     * Find an organization by its ID within the tenant.
     *
     * @param id The unique ID of the organization
     * @param options Query options for additional filtering
     * @returns The organization that matches the ID
     */
    findById(id: ID, options: OrganizationFindOptionsQueryDTO): Promise<IOrganization>;
    /**
     * CREATE organization for a specific tenant
     *
     * Creates a new organization within the tenant.
     *
     * @param entity The DTO containing organization details
     * @returns The newly created organization
     */
    create(entity: CreateOrganizationDTO): Promise<IOrganization>;
    /**
     * UPDATE organization by id
     *
     * Update an existing organization by its ID within the tenant.
     *
     * @param id The unique ID of the organization
     * @param entity The DTO containing updated organization details
     * @returns The updated organization
     */
    update(id: ID, entity: UpdateOrganizationDTO): Promise<IOrganization>;
}
