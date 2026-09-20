import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IIntegrationTenant } from '@gauzy/contracts';
/**
 * Resolver function to fetch integration tenant details before activating a specific route.
 *
 * @param route - The activated route snapshot.
 * @returns An observable containing integration tenant details or an empty observable on error.
 */
export declare const IntegrationResolver: ResolveFn<Observable<IIntegrationTenant | boolean>>;
