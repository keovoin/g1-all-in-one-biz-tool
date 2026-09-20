import { ID, IPagination, IUser, IUserOrganization } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '../core/crud';
import { EmployeeService } from '../employee/employee.service';
import { TypeOrmOrganizationRepository } from '../organization/repository/type-orm-organization.repository';
import { UserOrganization } from './user-organization.entity';
import { TypeOrmUserOrganizationRepository } from './repository/type-orm-user-organization.repository';
import { MikroOrmUserOrganizationRepository } from './repository/mikro-orm-user-organization.repository';
export declare class UserOrganizationService extends TenantAwareCrudService<UserOrganization> {
    readonly typeOrmUserOrganizationRepository: TypeOrmUserOrganizationRepository;
    readonly mikroOrmUserOrganizationRepository: MikroOrmUserOrganizationRepository;
    readonly typeOrmOrganizationRepository: TypeOrmOrganizationRepository;
    readonly employeeService: EmployeeService;
    constructor(typeOrmUserOrganizationRepository: TypeOrmUserOrganizationRepository, mikroOrmUserOrganizationRepository: MikroOrmUserOrganizationRepository, typeOrmOrganizationRepository: TypeOrmOrganizationRepository, employeeService: EmployeeService);
    /**
     * Finds all user organizations based on the provided filter options.
     *
     * Every loaded `user` relation is handed back as a real `User` instance, whichever ORM loaded it
     * and whether or not employees were requested, so the global `TransformInterceptor` can apply the
     * `@Exclude({ toPlainOnly: true })` redaction of the `User` credential columns.
     *
     * @param filter Optional filter options to apply when querying user organizations.
     * @param includeEmployee When true, attaches each user's employee record as `user.employee`.
     * @returns A promise resolving to the paginated user organizations.
     */
    findUserOrganizations(filter: BaseQueryDTO<UserOrganization>, includeEmployee: boolean): Promise<IPagination<UserOrganization>>;
    /**
     * Ensures a user organization row carries its loaded `user` as a `User` instance, merging in the
     * matching employee when one was found.
     *
     * SECURITY: `User.hash`, `refreshToken`, `code`, `codeExpireAt`, `emailVerifiedAt` and
     * `emailToken` are redacted only by class-transformer's `@Exclude({ toPlainOnly: true })`, whose
     * metadata is reached through the class prototype. A prototype-less user object therefore has
     * every credential column serialized verbatim by the global `TransformInterceptor`
     * (`instanceToPlain`). Such an object arises two ways: rebuilding a loaded entity with an object
     * spread (never do that here), and the MikroORM branch of `CrudService.findAll`, which returns
     * `wrap(entity).toJSON()` plain objects. The user is re-wrapped whenever it is not already a
     * `User` or an employee has to be attached — the same pattern as `UserService.findMeUser`.
     *
     * The employee is looked up by `userId`, falling back to the loaded `user.id` so a projection
     * that omits `userId` neither skips the re-wrap nor loses the employee.
     *
     * @param organization The user organization row as returned by `findAll` (mutated in place).
     * @param employeeMap Employee records keyed by user ID.
     * @returns The same row, with `user` safe to serialize.
     */
    private restoreUserPrototype;
    /**
     * Adds a user to all organizations within a specific tenant.
     *
     * @param userId The unique identifier of the user to be added to the organizations.
     * @param tenantId The unique identifier of the tenant whose organizations the user will be added to.
     * @returns A promise that resolves to an array of IUserOrganization, where each element represents the user's association with an organization in the tenant.
     */
    addUserToOrganization(user: IUser, organizationId: ID): Promise<IUserOrganization | IUserOrganization[]>;
    /**
     * Adds a user to all organizations within a given tenant..
     *
     * @param userId The unique identifier of the user to be added to the organizations.
     * @param tenantId The unique identifier of the tenant whose organizations the user will be added to.
     * @returns A promise that resolves to an array of IUserOrganization, representing the user-organization relationships created.
     */
    private _addUserToAllOrganizations;
}
