import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID, IPagination, IUserOrganization, IUserOrganizationCreateInput, IUserOrganizationFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class UsersOrganizationsService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Count the number of user organizations based on the provided filter.
     *
     * @param where - Optional filter criteria for counting user organizations.
     * @returns A promise that resolves to the count of user organizations.
     */
    getCount(where?: IUserOrganizationFindInput): Promise<number>;
    /**
     * Retrieves user organizations based on specified relations, conditions, and employee inclusion.
     *
     * @param relations An array of relation names to be eager loaded.
     * @param where Optional conditions to filter user organizations.
     * @param includeEmployee Specifies whether to include employee information.
     * @returns A promise that resolves to a paginated result of user organizations.
     */
    getAll(relations?: string[], where?: IUserOrganizationFindInput, includeEmployee?: boolean): Promise<IPagination<IUserOrganization>>;
    /**
     * Set user as inactive in the organization.
     *
     * @param id - The ID of the user organization.
     * @returns A promise that resolves to the updated user organization.
     */
    setUserAsInactive(id: ID): Promise<IUserOrganization>;
    /**
     * Get the count of organizations a user belongs to.
     *
     * @param id - The user ID.
     * @returns A promise that resolves to the count of organizations.
     */
    getUserOrganizationCount(id: ID): Promise<number>;
    /**
     * Remove user from the organization.
     *
     * @param id - The ID of the user organization.
     * @returns A promise that resolves to the removed user organization.
     */
    removeUserFromOrg(id: ID): Promise<IUserOrganization>;
    /**
     * Create a new user organization.
     *
     * @param input - The input data for creating a user organization.
     * @returns An observable that resolves to the created user organization.
     */
    create(input: IUserOrganizationCreateInput): Observable<IUserOrganization>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UsersOrganizationsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UsersOrganizationsService>;
}
