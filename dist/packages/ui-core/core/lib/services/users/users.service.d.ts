import { ID, IUser, IUserUiPreferences, IUserUiPreferencesUpdateInput, IUserUpdateInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class UsersService {
    private http;
    /**
     * Retrieves the current user's details, optionally including specified relations and employee data.
     *
     * @param relations - An array of relation names to include in the response.
     * @param includeEmployee - Whether to include employee details.
     * @returns A promise that resolves to the IUser object.
     */
    getMe(relations?: string[], includeEmployee?: boolean): Promise<IUser>;
    /**
     * Retrieves a user by their email address.
     *
     * @param emailId - The email address of the user to retrieve.
     * @returns A Promise that resolves with the user information.
     */
    getUserByEmail(emailId: string): Promise<IUser>;
    /**
     * Retrieves a user by their unique ID, optionally including related entities.
     *
     * @param id - The unique identifier of the user to retrieve.
     * @param relations - (Optional) An array of related entity names to include in the result.
     * @returns A Promise that resolves with the user information.
     */
    getUserById(id: string, relations?: string[]): Promise<IUser>;
    /**
     * Updates the user information for a specific user ID.
     *
     * @param id - The unique identifier of the user to update.
     * @param input - An object containing the updated user details.
     * @returns A Promise that resolves with the server's response after updating the user.
     */
    update(id: ID, input: IUserUpdateInput): Promise<any>;
    /**
     * Deletes a user by their ID.
     *
     * @param id - The unique identifier of the user to delete.
     * @param user - Additional user data or options (if required by the API) to be passed in the request.
     * @returns A Promise that resolves with the server's response after deleting the user.
     */
    delete(id: ID, user: any): Promise<any>;
    /**
     * Deletes all user-related data from the system.
     *
     * @returns A Promise that resolves once all user data has been successfully deleted.
     */
    deleteAllData(): Promise<any>;
    /**
     * Updates the user's preferred language setting.
     *
     * @param input - An object containing the user update information, including the new preferred language.
     * @returns A Promise that resolves once the preferred language has been successfully updated.
     */
    updatePreferredLanguage(input: IUserUpdateInput): Promise<any>;
    /**
     * Updates the user's preferred component layout setting.
     *
     * @param input - An object containing the user update information, including the new preferred layout preference.
     * @returns A Promise that resolves once the preferred layout has been successfully updated.
     */
    updatePreferredComponentLayout(input: IUserUpdateInput): Promise<any>;
    /**
     * Merges a per-feature patch into the current user's server-side UI preferences
     * (`PUT /user/ui-preferences`, shallow merge per top-level feature key).
     *
     * @param patch - Feature-keyed objects to replace, e.g. `{ aiChat: { expanded: true } }`.
     * @returns A Promise resolving to the merged preferences as now stored.
     */
    updateUiPreferences(patch: IUserUiPreferencesUpdateInput): Promise<IUserUiPreferences>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UsersService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UsersService>;
}
