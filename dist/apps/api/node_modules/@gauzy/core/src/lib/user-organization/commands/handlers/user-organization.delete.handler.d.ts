import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { UserOrganizationDeleteCommand } from '../user-organization.delete.command';
import { UserOrganization } from '../../user-organization.entity';
import { UserService } from '../../../user/user.service';
import { UserOrganizationService } from '../../user-organization.services';
import { RoleService } from '../../../role/role.service';
/**
 * 1. Remove user from given organization if user belongs to multiple organizations
 * 2. Remove user record if the user belongs only to the given organization
 * 3. Allow the deletion of Admin and Super Admin Users only if there are more than 1 users of that Role.
 * 4. When a Super Admins are deleted, they must be removed from all existing organizations.
 * 5. Super Admin user can be deleted only by a Super Admin user.
 */
export declare class UserOrganizationDeleteHandler implements ICommandHandler<UserOrganizationDeleteCommand> {
    private readonly _userOrganizationService;
    private readonly _userService;
    private readonly _roleService;
    constructor(_userOrganizationService: UserOrganizationService, _userService: UserService, _roleService: RoleService);
    /**
     * Executes a command to delete a user organization association.
     *
     * @param command The delete command containing input data.
     * @returns A promise resolving to either the deleted UserOrganization or DeleteResult.
     */
    execute(command: UserOrganizationDeleteCommand): Promise<UserOrganization | DeleteResult>;
    /**
     * Remove user from organization based on the number of organizations they belong to.
     *
     * @param userId The ID of the user to remove.
     * @param userOrganizationId The ID of the user organization association to remove.
     * @returns A promise resolving to either the deleted UserOrganization or DeleteResult.
     */
    private _removeUserFromOrganization;
    /**
     * Remove a Super Admin user from the system.
     *
     * @param id The ID of the Super Admin user to be removed.
     * @returns A promise resolving to either the deleted UserOrganization or DeleteResult.
     */
    private _removeSuperAdmin;
}
