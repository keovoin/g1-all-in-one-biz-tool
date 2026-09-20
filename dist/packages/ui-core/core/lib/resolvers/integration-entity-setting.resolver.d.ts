import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IIntegrationEntitySetting } from '@gauzy/contracts';
/**
 * Resolver function to fetch integration entity settings before activating a route.
 *
 * @param route - The activated route snapshot.
 * @returns An observable that emits integration entity settings or an empty observable on error.
 */
export declare const IntegrationEntitySettingResolver: ResolveFn<Observable<IIntegrationEntitySetting[] | never>>;
