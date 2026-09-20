import { ActivatedRoute } from '@angular/router';
import { IAuthResponse, IUserLoginInput } from '@gauzy/contracts';
import { NbAuthResult, NbAuthStrategy, NbAuthStrategyClass } from '@nebular/auth';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { Store } from '../store/store.service';
import { TimeTrackerService } from '../time-tracker/time-tracker.service';
import { TimesheetFilterService } from '../timesheet/timesheet-filter.service';
import { AuthService } from './auth.service';
import { ElectronService } from './electron.service';
import * as i0 from "@angular/core";
export declare class AuthStrategy extends NbAuthStrategy {
    private readonly route;
    private readonly authService;
    private readonly store;
    private readonly timeTrackerService;
    private readonly timesheetFilterService;
    private readonly cookieService;
    private readonly electronService;
    private static config;
    logout$: Subject<boolean>;
    constructor(route: ActivatedRoute, authService: AuthService, store: Store, timeTrackerService: TimeTrackerService, timesheetFilterService: TimesheetFilterService, cookieService: CookieService, electronService: ElectronService);
    static setup(options: {
        name: string;
    }): [NbAuthStrategyClass, any];
    authenticate(data?: any): Observable<NbAuthResult>;
    /**
     * Integrate client side remember me feature
     */
    rememberMe(data?: any): void;
    /**
     * Turn "the box is ticked" plus "this is what was displayed" into the claims
     * the API records.
     *
     * Returns `null` when the box was not ticked or when the form never received
     * the published documents — both are cases where there is nothing truthful to
     * record, and submitting anyway is precisely the bug this replaces. Callers
     * surface that as a validation failure rather than registering silently.
     */
    private buildTermsClaims;
    /**
     *
     * @param data
     * @returns
     */
    register(data?: any): Observable<NbAuthResult>;
    logout(): Observable<NbAuthResult>;
    /**
     * Forgot password request strategy
     *
     * @param data
     * @returns
     */
    requestPassword(data?: any): Observable<NbAuthResult>;
    resetPassword(data?: any): Observable<NbAuthResult>;
    refreshToken(data?: any): Observable<NbAuthResult>;
    private _logout;
    /**
     * Performs pre-logout actions.
     * Clears time tracking and timesheet filter, and logs out if the user is authenticated.
     */
    private _preLogout;
    login(loginInput: IUserLoginInput): Observable<NbAuthResult>;
    electronAuthentication({ user, token, refresh_token }: IAuthResponse): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthStrategy, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthStrategy>;
}
