import { OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IAuthResponse } from '@gauzy/contracts';
import { Store } from '../store';
import { AuthService } from '../auth';
import { ToastrService } from '../notification';
import { TimeTrackerService } from '../time-tracker';
import { TimesheetFilterService } from '../timesheet';
import * as i0 from "@angular/core";
/**
 * Service responsible for workspace switching with complete application reset.
 * Performs a full reset and data reload to ensure all components refresh properly.
 */
export declare class WorkspaceResetService implements OnDestroy {
    private readonly store;
    private readonly authService;
    private readonly toastrService;
    private readonly timeTrackerService;
    private readonly timesheetFilterService;
    reset$: Subject<boolean>;
    private destroy$;
    constructor(store: Store, authService: AuthService, toastrService: ToastrService, timeTrackerService: TimeTrackerService, timesheetFilterService: TimesheetFilterService);
    /**
     * Switch workspace with complete application reset.
     *
     * @param workspaceId The ID of the workspace to switch to
     * @returns Observable with the auth response
     */
    switchWorkspace(workspaceId: string): Observable<IAuthResponse>;
    /**
     * Apply new workspace data with complete application reset.
     *
     * @param response The auth response from workspace switch
     * @param preferredLanguage User's preferred language
     * @param themeName User's preferred theme
     */
    private applyWorkspaceData;
    /**
     * Perform complete application reset
     */
    private _reset;
    /**
     * Pre-reset cleanup actions
     */
    private _preReset;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceResetService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WorkspaceResetService>;
}
