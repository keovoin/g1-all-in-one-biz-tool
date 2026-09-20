import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IOrganization } from '@gauzy/contracts';
/**
 * Resolves the organization data before activating the route.
 *
 * This resolver function is used to fetch the organization data by its profile link
 * and ID before the route is activated. In case of an error during data retrieval,
 * it handles the error by redirecting to the home page and logging the error.
 *
 * @param route The ActivatedRouteSnapshot containing route parameters, including
 *              the profile link and organization ID.
 * @returns An observable of the resolved IOrganization object. In case of an error,
 *          it returns an empty observable and navigates to the home page.
 */
export declare const PublicOrganizationResolver: ResolveFn<Observable<IOrganization>>;
