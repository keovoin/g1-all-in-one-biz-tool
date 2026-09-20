import { ID, IEditEntityByMemberInput, IOrganizationDepartment, IOrganizationDepartmentCreateInput, IPagination } from '@gauzy/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { DeepPartial } from 'typeorm';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { OrganizationDepartment } from './organization-department.entity';
import { OrganizationDepartmentService } from './organization-department.service';
export declare class OrganizationDepartmentController extends CrudController<OrganizationDepartment> {
    private readonly organizationDepartmentService;
    private readonly commandBus;
    constructor(organizationDepartmentService: OrganizationDepartmentService, commandBus: CommandBus);
    /**
     * GET organization department by employee
     *
     * @param id
     * @returns
     */
    findByEmployee(id: ID): Promise<IPagination<OrganizationDepartment>>;
    /**
     * UPDATE organization department by employee
     *
     * @param entity
     * @returns
     */
    updateByEmployee(entity: IEditEntityByMemberInput): Promise<void>;
    /**
     * GET all organization department
     *
     * @param data
     * @returns
     */
    findAll(data: any): Promise<IPagination<IOrganizationDepartment>>;
    /**
     * Get pagination data of organization department
     *
     * @param id
     * @param entity
     * @returns
     */
    pagination(filter: BaseQueryDTO<OrganizationDepartment>): Promise<IPagination<IOrganizationDepartment>>;
    /**
     * UPDATE organization department by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: IOrganizationDepartmentCreateInput): Promise<IOrganizationDepartment>;
    /**
     * CREATE organization department
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     *
     * @param entity
     * @returns
     */
    create(entity: DeepPartial<OrganizationDepartment>): Promise<OrganizationDepartment>;
    /**
     * DELETE organization department by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     *
     * @param id
     * @returns
     */
    delete(id: ID): Promise<any>;
    /**
     * SOFT DELETE organization department by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     *
     * @param id
     * @returns
     */
    softRemove(id: ID, ...options: any[]): Promise<OrganizationDepartment>;
    /**
     * RESTORE a soft-deleted organization department by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     *
     * @param id
     * @returns
     */
    softRecover(id: ID, ...options: any[]): Promise<OrganizationDepartment>;
}
