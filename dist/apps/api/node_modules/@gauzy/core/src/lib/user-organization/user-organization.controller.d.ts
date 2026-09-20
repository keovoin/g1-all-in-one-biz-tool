import { CommandBus } from '@nestjs/cqrs';
import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IUserOrganization, IPagination, ID } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { UserOrganizationService } from './user-organization.services';
import { UserOrganization } from './user-organization.entity';
import { FindMeUserOrganizationDTO } from './dto/find-me-user-organization.dto';
export declare class UserOrganizationController extends CrudController<UserOrganization> {
    private readonly userOrganizationService;
    private readonly commandBus;
    constructor(userOrganizationService: UserOrganizationService, commandBus: CommandBus);
    /**
     * Find all UserOrganizations.
     *
     * @param params - The pagination parameters.
     * @param query - Additional query parameters to filter results.
     * @returns A paginated list of UserOrganizations.
     */
    findAll(params: BaseQueryDTO<UserOrganization>, query: FindMeUserOrganizationDTO): Promise<IPagination<IUserOrganization>>;
    /**
     * Delete user from organization.
     *
     * @param id - The ID of the user organization to delete.
     * @param user - The user making the request.
     * @param language - The language to use for any error messages or responses.
     * @returns The deleted user organization.
     */
    delete(id: ID): Promise<IUserOrganization>;
    /**
     * Add a user to an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. Without an
     * override there is no handler on this class for the decorator to sit on, and `PermissionGuard`
     * authorizes any route whose permission metadata is empty. Method metadata is not inherited by an
     * override, so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param entity - The membership to create.
     * @returns The created membership.
     */
    create(entity: DeepPartial<UserOrganization>): Promise<UserOrganization>;
    /**
     * Update a user's membership of an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. See
     * {@link create} for why an override is required. Method metadata is not inherited by an override,
     * so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param id - The membership to update.
     * @param entity - The fields to update.
     * @returns The updated membership.
     */
    update(id: ID, entity: QueryDeepPartialEntity<UserOrganization>): Promise<any>;
    /**
     * Soft-delete a user's membership of an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. See
     * {@link create} for why an override is required. Method metadata is not inherited by an override,
     * so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param id - The membership to soft-delete.
     * @returns The soft-deleted membership.
     */
    softRemove(id: ID): Promise<UserOrganization>;
    /**
     * Restore a soft-deleted membership of an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. See
     * {@link create} for why an override is required. Method metadata is not inherited by an override,
     * so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param id - The membership to restore.
     * @returns The restored membership.
     */
    softRecover(id: ID): Promise<UserOrganization>;
    /**
     * Find the number of organizations a user belongs to.
     *
     * @param id - The user ID.
     * @returns The count of organizations the user belongs to.
     */
    findOrganizationCount(id: ID): Promise<number>;
}
