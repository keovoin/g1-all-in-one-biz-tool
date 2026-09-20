import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IEmployee } from '@gauzy/contracts';
/**
 * Resolves the public employee data based on the provided route parameters.
 *
 * This resolver function retrieves employee data by calling the EmployeesService
 * and handles errors by navigating to the homepage and logging the error using
 * ErrorHandlingService. If an error occurs, it returns an empty observable.
 *
 * @param route - The ActivatedRouteSnapshot containing route parameters including
 *                the employee ID and slug used to fetch employee data.
 * @returns An observable of the public employee data.
 */
export declare const PublicEmployeeResolver: ResolveFn<Observable<IEmployee>>;
