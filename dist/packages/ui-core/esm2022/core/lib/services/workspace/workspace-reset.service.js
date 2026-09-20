import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '../store';
import { AuthService } from '../auth';
import { ToastrService } from '../notification';
import { TimeTrackerService } from '../time-tracker';
import { TimesheetFilterService } from '../timesheet';
import * as i0 from "@angular/core";
import * as i1 from "../store";
import * as i2 from "../auth";
import * as i3 from "../notification";
import * as i4 from "../time-tracker";
import * as i5 from "../timesheet";
/**
 * Service responsible for workspace switching with complete application reset.
 * Performs a full reset and data reload to ensure all components refresh properly.
 */
export class WorkspaceResetService {
    constructor(store, authService, toastrService, timeTrackerService, timesheetFilterService) {
        this.store = store;
        this.authService = authService;
        this.toastrService = toastrService;
        this.timeTrackerService = timeTrackerService;
        this.timesheetFilterService = timesheetFilterService;
        this.reset$ = new Subject();
        this.destroy$ = new Subject();
        this.reset$
            .pipe(distinctUntilChange(), tap(() => this._preReset()), takeUntil(this.destroy$))
            .subscribe();
    }
    /**
     * Switch workspace with complete application reset.
     *
     * @param workspaceId The ID of the workspace to switch to
     * @returns Observable with the auth response
     */
    switchWorkspace(workspaceId) {
        // Save current preferences before switch
        const preferredLanguage = this.store.preferredLanguage;
        const themeName = localStorage.getItem('themeName');
        return this.authService.switchWorkspace(workspaceId).pipe(tap(async (response) => {
            // Apply new workspace data with complete reset
            await this.applyWorkspaceData(response, preferredLanguage, themeName);
        }), catchError((error) => {
            this.toastrService.danger('Failed to switch workspace', 'Error');
            throw error;
        }));
    }
    /**
     * Apply new workspace data with complete application reset.
     *
     * @param response The auth response from workspace switch
     * @param preferredLanguage User's preferred language
     * @param themeName User's preferred theme
     */
    async applyWorkspaceData(response, preferredLanguage, themeName) {
        // STEP 1: Complete application reset
        await this._reset(preferredLanguage);
        // STEP 2: Apply new workspace data
        const { user, token, refresh_token } = response;
        this.store.userId = user.id;
        this.store.token = token;
        this.store.refresh_token = refresh_token;
        this.store.organizationId = user.employee?.organizationId;
        this.store.tenantId = user.tenantId;
        this.store.user = user;
        // STEP 3: Set organization
        if (user.employee?.organization) {
            this.store.selectedOrganization = user.employee.organization;
        }
        // STEP 4: Restore user preferences
        this.store.preferredLanguage = preferredLanguage;
        if (themeName) {
            localStorage.setItem('themeName', themeName);
        }
        // STEP 5: Success notification
        this.toastrService.success('Workspace switched successfully!', 'Success');
        // STEP 6: Reload page to ensure everything is refreshed
        // A full page reload is necessary to:
        // - Clear all in-memory state and caches
        // - Re-initialize all services with new workspace context
        // - Ensure all lazy-loaded modules are reloaded
        // - Reset any third-party libraries that maintain internal state
        window.location.reload();
    }
    /**
     * Perform complete application reset
     */
    async _reset(preferredLanguage) {
        // Trigger pre-reset actions
        this.reset$.next(true);
        // Complete store reset
        this.store.clear();
        this.store.serverConnection = 200;
        this.store.preferredLanguage = preferredLanguage;
    }
    /**
     * Pre-reset cleanup actions
     */
    async _preReset() {
        // Clean up time tracking and timesheet filters
        if (this.store.user?.employee) {
            if (this.timeTrackerService.running) {
                if (this.timeTrackerService.timerSynced.isExternalSource) {
                    this.timeTrackerService.remoteToggle();
                }
                else {
                    await this.timeTrackerService.toggle();
                }
            }
            this.timeTrackerService.clearTimeTracker();
            this.timesheetFilterService.clear();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.reset$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceResetService, deps: [{ token: i1.Store }, { token: i2.AuthService }, { token: i3.ToastrService }, { token: i4.TimeTrackerService }, { token: i5.TimesheetFilterService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceResetService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceResetService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.AuthService }, { type: i3.ToastrService }, { type: i4.TimeTrackerService }, { type: i5.TimesheetFilterService }] });
//# sourceMappingURL=workspace-reset.service.js.map