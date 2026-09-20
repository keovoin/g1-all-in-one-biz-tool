import { DeepPartial } from 'typeorm';
import { ID, IOrganizationPosition, IPagination } from '@gauzy/contracts';
import { CrudController } from './../core/crud';
import { OrganizationPositionService } from './organization-position.service';
import { OrganizationPosition } from './organization-position.entity';
import { UpdateOrganizationPositionDTO } from './dto';
export declare class OrganizationPositionController extends CrudController<OrganizationPosition> {
    private readonly organizationPositionService;
    constructor(organizationPositionService: OrganizationPositionService);
    /**
     * GET organization positions recurring expense
     *
     * @param data
     * @returns
     */
    findAll(data: any): Promise<IPagination<IOrganizationPosition>>;
    /**
     * UPDATE organization position by id
     *
     * @param id
     * @param body
     * @returns
     */
    update(id: string, body: UpdateOrganizationPositionDTO): Promise<IOrganizationPosition>;
    /**
     * CREATE organization position
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    create(entity: DeepPartial<OrganizationPosition>): Promise<OrganizationPosition>;
    /**
     * DELETE organization position by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    delete(id: ID): Promise<any>;
    /**
     * SOFT DELETE organization position by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    softRemove(id: ID, ...options: any[]): Promise<OrganizationPosition>;
    /**
     * RESTORE a soft-deleted organization position by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    softRecover(id: ID, ...options: any[]): Promise<OrganizationPosition>;
}
