import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguagesEnum } from '@gauzy/contracts';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { NbAuthResult, NbAuthStrategy } from '@nebular/auth';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, Subject, from, of, tap } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { deleteCookie } from '../../auth/cookie-helper';
import { Store } from '../store/store.service';
import { TimeTrackerService } from '../time-tracker/time-tracker.service';
import { TimesheetFilterService } from '../timesheet/timesheet-filter.service';
import { AuthService } from './auth.service';
import { ElectronService } from './electron.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "./auth.service";
import * as i3 from "../store/store.service";
import * as i4 from "../time-tracker/time-tracker.service";
import * as i5 from "../timesheet/timesheet-filter.service";
import * as i6 from "ngx-cookie-service";
import * as i7 from "./electron.service";
export class AuthStrategy extends NbAuthStrategy {
    static { this.config = {
        login: {
            redirect: {
                success: '/',
                failure: null
            },
            defaultErrors: ['Login/Email combination is not correct, please try again.'],
            defaultMessages: ['You have been successfully logged in.']
        },
        register: {
            redirect: {
                success: '/',
                failure: null
            },
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['You have been successfully registered.']
        },
        logout: {
            redirect: {
                success: '/',
                failure: null
            },
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['You have been successfully logged out.']
        },
        requestPass: {
            redirect: {
                success: '/',
                failure: null
            },
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['Reset password instructions have been sent to your email.']
        },
        resetPass: {
            redirect: {
                success: '/',
                failure: null
            },
            resetPasswordTokenKey: 'reset_password_token',
            defaultErrors: ['Password Reset Failed.'],
            defaultMessages: ['Your password has been successfully changed.']
        }
    }; }
    constructor(route, authService, store, timeTrackerService, timesheetFilterService, cookieService, electronService) {
        super();
        this.route = route;
        this.authService = authService;
        this.store = store;
        this.timeTrackerService = timeTrackerService;
        this.timesheetFilterService = timesheetFilterService;
        this.cookieService = cookieService;
        this.electronService = electronService;
        this.logout$ = new Subject();
        this.logout$
            .pipe(distinctUntilChange(), tap(() => this._preLogout()))
            .subscribe();
    }
    static setup(options) {
        return [AuthStrategy, options];
    }
    authenticate(data) {
        const { email, password } = data;
        return this.login({
            email,
            password
        }).pipe(tap(() => this.rememberMe(data)));
    }
    /**
     * Integrate client side remember me feature
     */
    rememberMe(data) {
        const rememberMe = !!data.rememberMe;
        if (rememberMe) {
            this.cookieService.set('email', data.email?.trim());
            this.cookieService.set('rememberMe', 'true');
        }
        else {
            this.cookieService.delete('rememberMe');
            this.cookieService.delete('email');
        }
    }
    /**
     * Turn "the box is ticked" plus "this is what was displayed" into the claims
     * the API records.
     *
     * Returns `null` when the box was not ticked or when the form never received
     * the published documents — both are cases where there is nothing truthful to
     * record, and submitting anyway is precisely the bug this replaces. Callers
     * surface that as a validation failure rather than registering silently.
     */
    buildTermsClaims(accepted, documents) {
        if (!accepted || !isNotEmpty(documents)) {
            return null;
        }
        return documents.map(({ documentId, version, sha256, locale }) => ({
            documentId,
            version,
            sha256,
            locale
        }));
    }
    /**
     *
     * @param data
     * @returns
     */
    register(data) {
        const { email, fullName, password, confirmPassword, tenant, tags, terms, termsDocuments, preferredLanguage = LanguagesEnum.ENGLISH } = data;
        if (password !== confirmPassword) {
            return of(new NbAuthResult(false, null, null, ["The passwords don't match."]));
        }
        // The register form gates its submit button on `terms`, and this
        // destructuring used to drop the value on the floor: the payload built
        // below never mentioned it, so the user saw a checkbox and the database
        // got nothing. `termsDocuments` carries the identity of the exact text
        // that was displayed next to it — document id, version and sha256, as
        // published by the server — so the acceptance can be recorded as
        // evidence rather than as an assertion.
        const termsClaims = this.buildTermsClaims(terms, termsDocuments);
        if (!termsClaims) {
            return of(new NbAuthResult(false, null, null, [
                'Please accept the Terms and Conditions and the Privacy Policy to continue.'
            ]));
        }
        /**
         *
         */
        const register = {
            user: {
                firstName: fullName ? fullName.split(' ').slice(0, -1).join(' ') : null,
                lastName: fullName ? fullName.split(' ').slice(-1).join(' ') : null,
                email: email?.trim(),
                tenant,
                tags,
                preferredLanguage
            },
            password,
            confirmPassword,
            terms: termsClaims
        };
        return this.authService.register(register).pipe(switchMap((res) => {
            if (res.status === 400) {
                throw new Error(res.message);
            }
            const user = res;
            if (isNotEmpty(user)) {
                return this.login({ email, password });
            }
            else {
                return EMPTY; // Ensure an observable is returned
            }
        }), catchError((err) => {
            return of(new NbAuthResult(false, err, false, AuthStrategy.config.register.defaultErrors, [
                AuthStrategy.config.register.defaultErrors
            ]));
        }));
    }
    logout() {
        return from(this._logout());
    }
    /**
     * Forgot password request strategy
     *
     * @param data
     * @returns
     */
    requestPassword(data) {
        const { email } = data;
        return this.authService
            .requestPassword({
            email
        })
            .pipe(map((value) => {
            if (typeof value === 'boolean') {
                return new NbAuthResult(true, value, false, [], AuthStrategy.config.requestPass.defaultMessages);
            }
            return new NbAuthResult(false, value.response, false, value.message || AuthStrategy.config.requestPass.defaultErrors);
        }), catchError((error) => {
            return of(new NbAuthResult(false, error, false, AuthStrategy.config.requestPass.defaultErrors, [
                AuthStrategy.config.requestPass.defaultErrors
            ]));
        }));
    }
    resetPassword(data) {
        const { password, confirmPassword } = data;
        const token = this.route.snapshot.queryParamMap.get('token');
        if (password !== confirmPassword) {
            return of(new NbAuthResult(false, null, null, ['The password and confirmation password do not match.']));
        }
        return this.authService
            .resetPassword({
            token,
            password,
            confirmPassword
        })
            .pipe(map((res) => {
            if (res.status === 400) {
                throw new Error(res.message);
            }
            return new NbAuthResult(true, res, AuthStrategy.config.resetPass.redirect.success, [], AuthStrategy.config.resetPass.defaultMessages);
        }), catchError((err) => {
            return of(new NbAuthResult(false, err, false, AuthStrategy.config.resetPass.defaultErrors, [
                AuthStrategy.config.resetPass.defaultErrors
            ]));
        }));
    }
    refreshToken(data) {
        throw new Error('Not implemented yet');
    }
    async _logout() {
        const preferredLanguage = this.store.preferredLanguage;
        this.logout$.next(true);
        this.store.clear();
        this.store.serverConnection = 200;
        this.store.preferredLanguage = preferredLanguage;
        if (this.electronService.isElectron) {
            this.electronService.ipcRenderer.send('logout');
        }
        return new NbAuthResult(true, null, AuthStrategy.config.logout.redirect.success, [], AuthStrategy.config.logout.defaultMessages);
    }
    /**
     * Performs pre-logout actions.
     * Clears time tracking and timesheet filter, and logs out if the user is authenticated.
     */
    async _preLogout() {
        if (this.store.refresh_token) {
            this.authService
                .doLogout(this.store.refresh_token)
                .pipe(take(1), catchError(() => EMPTY))
                .subscribe();
        }
        //remove time tracking/timesheet filter just before logout
        if (this.store.user && this.store.user.employee) {
            if (this.timeTrackerService.running) {
                if (this.timeTrackerService.timerSynced?.isExternalSource) {
                    this.timeTrackerService.remoteToggle();
                }
                else {
                    await this.timeTrackerService.toggle();
                }
            }
            this.timeTrackerService.clearTimeTracker();
            this.timesheetFilterService.clear();
        }
        // Delete cookies
        deleteCookie('userId', { SameSite: 'None', Secure: true }); // Default path
        deleteCookie('token', { SameSite: 'None', Secure: true }); // Default path
        deleteCookie('refresh_token', { SameSite: 'None', Secure: true }); // Default path
    }
    login(loginInput) {
        loginInput.email = loginInput.email?.trim();
        return this.authService.login(loginInput).pipe(map((res) => {
            let user, token, refresh_token;
            if (res) {
                user = res.user;
                token = res.token;
                refresh_token = res.refresh_token;
            }
            if (!user) {
                return new NbAuthResult(false, res, false, AuthStrategy.config.login.defaultErrors);
            }
            // Reset selectedOrganization to prevent stale data from previous session.
            // OrganizationSelectorComponent will set the correct organization after login.
            this.store.selectedOrganization = user?.employee?.organization ?? null;
            this.store.userId = user.id;
            this.store.token = token;
            this.store.refresh_token = refresh_token;
            this.store.organizationId = user?.employee?.organizationId;
            this.store.tenantId = user?.tenantId;
            this.store.user = user;
            this.electronAuthentication({ user, token, refresh_token });
            return new NbAuthResult(true, res, this.route.snapshot.queryParams['returnUrl'] || AuthStrategy.config.login.redirect.success, [], AuthStrategy.config.login.defaultMessages);
        }), catchError((err) => {
            console.log(err);
            return of(new NbAuthResult(false, err, false, AuthStrategy.config.login.defaultErrors, [
                AuthStrategy.config.login.defaultErrors
            ]));
        }));
    }
    electronAuthentication({ user, token, refresh_token }) {
        try {
            if (this.electronService.isElectron) {
                this.electronService.ipcRenderer.send('auth_success', {
                    user: user,
                    token: token,
                    refreshToken: refresh_token,
                    userId: user.id,
                    employeeId: user.employee ? user.employee.id : null,
                    organizationId: user.employee ? user.employee.organizationId : null,
                    tenantId: user.tenantId ? user.tenantId : null
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthStrategy, deps: [{ token: i1.ActivatedRoute }, { token: i2.AuthService }, { token: i3.Store }, { token: i4.TimeTrackerService }, { token: i5.TimesheetFilterService }, { token: i6.CookieService }, { token: i7.ElectronService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthStrategy }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.ActivatedRoute }, { type: i2.AuthService }, { type: i3.Store }, { type: i4.TimeTrackerService }, { type: i5.TimesheetFilterService }, { type: i6.CookieService }, { type: i7.ElectronService }] });
//# sourceMappingURL=auth-strategy.service.js.map