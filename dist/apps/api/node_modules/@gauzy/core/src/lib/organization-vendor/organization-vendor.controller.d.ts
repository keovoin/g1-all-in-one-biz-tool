import { ID, IOrganizationVendor, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { OrganizationVendorService } from './organization-vendor.service';
import { OrganizationVendor } from './organization-vendor.entity';
export declare class OrganizationVendorController extends CrudController<OrganizationVendor> {
    private readonly organizationVendorService;
    constructor(organizationVendorService: OrganizationVendorService);
    /**
     * GET all organization vendors recurring expense
     *
     * @param data
     * @returns
     */
    findAll(data: any): Promise<IPagination<IOrganizationVendor>>;
    pagination(filter: BaseQueryDTO<OrganizationVendor>): Promise<IPagination<IOrganizationVendor>>;
    /**
     * UPDATE organization vendor by id
     *
     * @param id
     * @param body
     * @returns
     */
    update(id: string, body: OrganizationVendor): Promise<IOrganizationVendor>;
    /**
     * DELETE organization vendor by id
     *
     * @param id
     * @returns
     */
    delete(id: string): Promise<any>;
    /**
     * SOFT DELETE organization vendor by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    softRemove(id: ID, ...options: any[]): Promise<OrganizationVendor>;
    /**
     * RESTORE a soft-deleted organization vendor by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    softRecover(id: ID, ...options: any[]): Promise<OrganizationVendor>;
}
