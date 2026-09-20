import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IIntegrationSetting } from '@gauzy/contracts';
/**
 * Resolver function to fetch integration settings before activating the route.
 *
 * @param route - The activated route snapshot.
 * @returns An observable that emits integration settings or an empty observable on error.
 */
export declare const IntegrationSettingResolver: ResolveFn<Observable<IIntegrationSetting[]> | boolean>;
