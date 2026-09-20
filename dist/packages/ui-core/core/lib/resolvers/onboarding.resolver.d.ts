import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '@gauzy/contracts';
/**
 * Retrieves the user data and performs onboarding-related navigation.
 *
 * @returns Observable<IUser | null> - An observable that emits the user data or null in case of an error.
 */
export declare const OnboardingResolver: ResolveFn<Observable<IUser | null>>;
