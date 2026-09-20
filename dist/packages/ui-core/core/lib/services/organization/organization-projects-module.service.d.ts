import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrganizationProjectModule, IPagination, ID, IOrganizationProjectModuleFindInput } from '@gauzy/contracts';
import { CrudService } from '../crud';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
export declare class OrganizationProjectModuleService extends CrudService<IOrganizationProjectModule> {
    private readonly toastrService;
    private static readonly API_URL;
    /**
     * BehaviorSubject to notify components when project modules are updated.
     * This ensures that all components displaying modules stay synchronized.
     */
    private moduleUpdatedSubject;
    /**
     * Observable that components can subscribe to for module update notifications.
     */
    moduleUpdated$: Observable<void>;
    constructor(http: HttpClient, toastrService: ToastrService);
    /**
     * Notifies subscribers that a module update has occurred.
     */
    notifyModuleUpdated(): void;
    getAllModulesByProjectId(where: IOrganizationProjectModuleFindInput, relations?: string[]): Observable<IPagination<IOrganizationProjectModule>>;
    /**
     * Find project modules for an employee based on pagination parameters.
     * @param params - The pagination parameters for filtering employee project modules.
     * @returns An Observable that emits the paginated list of employee project modules.
     */
    getEmployeeProjectModules(params: HttpParams): Observable<IPagination<IOrganizationProjectModule>>;
    /**
     * Retrieve project modules associated with a team using pagination parameters.
     * @param params - The pagination parameters for filtering team project modules.
     * @returns An Observable that emits the paginated list of team project modules.
     */
    findTeamProjectModules(params: HttpParams): Observable<IPagination<IOrganizationProjectModule>>;
    /**
     * Retrieve project modules associated with a specific employee.
     * @param employeeId - The unique identifier of the employee.
     * @param params - Additional query parameters for filtering.
     * @returns An Observable that emits the paginated list of project modules for the specified employee.
     */
    findByEmployee(employeeId: ID, params: HttpParams): Observable<IPagination<IOrganizationProjectModule>>;
    /**
     * Find a specific project module by its unique identifier.
     * @param id - The unique identifier of the project module.
     * @param params - Additional query parameters if required.
     * @returns An Observable that emits the found project module.
     */
    findById(id: ID, params: HttpParams): Observable<IOrganizationProjectModule>;
    errorHandler(error: HttpErrorResponse): Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationProjectModuleService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationProjectModuleService>;
}
