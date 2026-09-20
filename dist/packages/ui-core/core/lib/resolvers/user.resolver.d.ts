import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '@gauzy/contracts';
/**
 * Resolves the current user data and handles navigation based on the user's tenant status.
 *
 * @returns An observable of the user ID or an observable of error in case of failure.
 */
export declare const UserResolver: ResolveFn<Observable<IUser | null>>;
