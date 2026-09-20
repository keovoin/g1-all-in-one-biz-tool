import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrganizationProjectCreateInput, IOrganizationProject, IOrganizationProjectsFindInput, IPagination, IOrganizationProjectUpdateInput, IOrganizationProjectSetting, ID, IOrganizationProjectEditByEmployeeInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationProjectsService {
    private readonly _http;
    private readonly API_URL;
    constructor(_http: HttpClient);
    /**
     * Creates a new organization project.
     *
     * @param input The input data for creating the project.
     * @returns A Promise that resolves with the newly created project.
     */
    create(input: IOrganizationProjectCreateInput): Promise<IOrganizationProject>;
    /**
     * Checks if a specific employee is a manager of a given project.
     *
     * This method makes a GET request to the backend to verify if the employee is part of the project
     * and if they hold the 'manager' role within the project team.
     *
     * @param projectId - The ID of the project to check.
     * @param employeeId - The ID of the employee to verify.
     * @returns An observable that resolves to a boolean indicating if the employee is a manager of the project.
     *          Returns `true` if the employee is a manager, otherwise `false`.
     */
    isManagerOfProject(projectId: ID, employeeId: ID): Observable<boolean>;
    /**
     * Edits an existing organization project.
     *
     * @param input The input data for updating the project. Partial data is accepted.
     * @returns A Promise that resolves with the updated project.
     */
    edit(input: Partial<IOrganizationProjectUpdateInput>): Promise<IOrganizationProject>;
    /**
     * Retrieves all projects assigned to a specific employee.
     *
     * @param id The employee ID.
     * @param where Optional filters to apply when retrieving projects.
     * @returns A Promise that resolves with a list of organization projects assigned to the employee.
     */
    getAllByEmployee(id: ID, where?: IOrganizationProjectsFindInput): Promise<IOrganizationProject[]>;
    /**
     * Retrieves all organization projects, with optional relations and filters.
     *
     * @param relations Optional array of related entities to include.
     * @param where Optional filters to apply when retrieving projects.
     * @returns A Promise that resolves with paginated organization projects.
     */
    getAll(relations?: string[], where?: IOrganizationProjectsFindInput): Promise<IPagination<IOrganizationProject>>;
    /**
     * Retrieves a specific organization project by its ID.
     *
     * @param id The ID of the project.
     * @param relations Optional array of related entities to include.
     * @returns An Observable that resolves with the requested project.
     */
    getById(id: ID, relations?: string[]): Observable<IOrganizationProject>;
    /**
     * Retrieves the total count of organization projects that match the given criteria.
     *
     * @param request The input criteria for finding the projects.
     * @returns A Promise that resolves with the count of matching projects.
     */
    getCount(request: IOrganizationProjectsFindInput): Promise<number>;
    /**
     * Updates project assignments for an employee.
     *
     * @param updateInput The input data containing employee and project information.
     * @returns A Promise that resolves once the update operation is complete.
     */
    updateByEmployee(updateInput: IOrganizationProjectEditByEmployeeInput): Promise<any>;
    /**
     * Updates the task view mode for a specific project.
     *
     * @param id The ID of the project.
     * @param input The input data for updating the task view mode.
     * @returns A Promise that resolves with the updated project.
     */
    updateTaskViewMode(id: ID, input: IOrganizationProjectUpdateInput): Promise<IOrganizationProject>;
    /**
     * Deletes an organization project by its ID.
     *
     * @param id The ID of the project to delete.
     * @returns A Promise that resolves once the project is deleted.
     */
    delete(id: ID): Promise<any>;
    /**
     * Updates the settings for an organization project.
     *
     * @param id - The unique identifier (ID) of the organization project to update.
     * @param input - The updated project settings to apply.
     *
     * @returns An Observable of type `IOrganizationProject` representing the updated organization project.
     */
    updateProjectSetting(id: ID, input: IOrganizationProjectSetting): Observable<IOrganizationProjectSetting>;
    /**
     * Retrieve a list of synchronized organization projects with Github Repositories.
     *
     * @param where - Criteria for filtering projects.
     * @param relations - An array of related entities to include in the response (optional).
     * @returns An observable containing the paginated list of synchronized organization projects.
     */
    findSyncedProjects(where: IOrganizationProjectsFindInput, relations?: string[]): Observable<IPagination<IOrganizationProject>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationProjectsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationProjectsService>;
}
