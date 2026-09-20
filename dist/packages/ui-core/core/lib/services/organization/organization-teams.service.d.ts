import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IOrganizationTeam, IOrganizationTeamFindInput, IOrganizationTeamCreateInput, IPagination, IOrganizationTeamUpdateInput, IBasePerTenantAndOrganizationEntityModel, ID } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationTeamsService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Creates a new organization team.
     *
     * @param input - The input data for creating the team.
     * @returns A promise that resolves to the created organization team.
     */
    create(input: IOrganizationTeamCreateInput): Promise<IOrganizationTeam>;
    /**
     * Retrieves all organization teams, optionally filtered and related.
     *
     * @param relations - An array of relations to include in the response.
     * @param where - Optional filter criteria for retrieving teams.
     * @returns A promise that resolves to a paginated list of organization teams.
     */
    getAll(relations?: string[], where?: IOrganizationTeamFindInput): Promise<IPagination<IOrganizationTeam>>;
    /**
     * Updates an existing organization team.
     *
     * @param id - The ID of the team to update.
     * @param input - The input data for updating the team.
     * @returns A promise that resolves to the updated organization team or a response.
     */
    update(id: ID, input: IOrganizationTeamUpdateInput): Promise<IOrganizationTeam>;
    /**
     * Deletes an organization team by ID.
     *
     * @param id - The ID of the team to delete.
     * @param params - Additional parameters for the delete request.
     * @returns A promise that resolves to the deleted organization team or an error response.
     */
    delete(id: ID, params: IBasePerTenantAndOrganizationEntityModel): Promise<IOrganizationTeam | HttpErrorResponse>;
    /**
     * Gets the count of organization teams based on the provided filter.
     *
     * @param params - The filter criteria for counting teams.
     * @returns A promise that resolves to the number of organization teams.
     */
    getCount(params: IOrganizationTeamFindInput): Promise<number>;
    /**
     * Fetches the teams associated with the authenticated user.
     *
     * @param where - Optional filter criteria for fetching teams.
     * @param relations - Optional list of relations to include in the response.
     * @returns A promise that resolves to a paginated list of organization teams.
     */
    getMyTeams(where?: IOrganizationTeamFindInput, relations?: string[]): Promise<IPagination<IOrganizationTeam>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationTeamsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationTeamsService>;
}
