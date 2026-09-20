import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
/**
 * Resolver function to fetch the employee count for the given organization.
 *
 * @param route - The activated route snapshot.
 * @returns An observable of the employee count or 0 in case of an error or missing organization ID.
 */
export declare const EmployeeCountResolver: ResolveFn<Observable<number>>;
