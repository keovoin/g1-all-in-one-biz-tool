import { DeepPartial } from 'typeorm';
import { ID, IOrganizationEmploymentType, IPagination } from '@gauzy/contracts';
import { CrudController } from './../core/crud';
import { OrganizationEmploymentType } from './organization-employment-type.entity';
import { OrganizationEmploymentTypeService } from './organization-employment-type.service';
export declare class OrganizationEmploymentTypeController extends CrudController<OrganizationEmploymentType> {
    private readonly organizationEmploymentTypeService;
    constructor(organizationEmploymentTypeService: OrganizationEmploymentTypeService);
    /**
     * GET all organization employment types
     *
     * @param data
     * @returns
     */
    findAll(data: any): Promise<IPagination<IOrganizationEmploymentType>>;
    /**
     * UPDATE organization employment type by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: string, entity: OrganizationEmploymentType): Promise<IOrganizationEmploymentType>;
    /**
     * CREATE organization employment type
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    create(entity: DeepPartial<OrganizationEmploymentType>): Promise<OrganizationEmploymentType>;
    /**
     * DELETE organization employment type by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    delete(id: ID): Promise<any>;
    /**
     * SOFT DELETE organization employment type by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    softRemove(id: ID, ...options: any[]): Promise<OrganizationEmploymentType>;
    /**
     * RESTORE a soft-deleted organization employment type by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    softRecover(id: ID, ...options: any[]): Promise<OrganizationEmploymentType>;
}
