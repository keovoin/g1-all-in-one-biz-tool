import { OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { IEmployee, IUser } from '@gauzy/contracts';
import { EmployeesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class UserMenuComponent implements OnInit, OnDestroy {
    private readonly _employeeService;
    private readonly _errorHandler;
    private _user$;
    private _employee$;
    /**
     * The employee lookup and the status update run independently — a user or
     * organization switch can start a lookup while `onChangeStatus()` is still
     * waiting on the server — so each keeps its own in-flight flag. With a single
     * shared flag, whichever request settled first re-enabled the status control
     * while the other was still running.
     */
    private _isLoadingEmployee$;
    private _isUpdatingStatus$;
    private _isSubmit$;
    platFormWebSiteUrl: string;
    close: EventEmitter<any>;
    /**
     * Whether an outside click is allowed to close this panel yet. Same reason
     * as `gauzy-workspace-menu`: `gauzyOutside` listens on `document`, so arming
     * has to be deferred past the click that opened the panel. This replaces a
     * counter that required TWO outside clicks to dismiss — the first was
     * swallowed by the panel (576x288 over the lower-left of the page) and did
     * nothing at all, which is one of the "clicks do nothing" reports.
     */
    private armed;
    private armTimer;
    private clickedInOverlay;
    /**
     * Identifies the employee lookup currently in flight. The panel can stay open
     * across a user or organization switch, so a slow earlier request can settle
     * after a newer one; anything that no longer matches this counter is stale and
     * must not touch the employee or the loading state.
     */
    private lookupId;
    trackOverlayClick(target: EventTarget | null): void;
    /**
     * Each entry carries a `label` translation key because the anchors render an
     * icon only — without it a screen reader announces five identical links.
     */
    downloadApps: {
        link: string;
        icon: string;
        label: string;
    }[];
    constructor(_employeeService: EmployeesService, _errorHandler: ErrorHandlingService);
    ngOnInit(): void;
    onClick(): void;
    onClickOutside(clickedInside: boolean): void;
    ngOnDestroy(): void;
    onChangeStatus(): Promise<void>;
    get employee(): IEmployee;
    get employee$(): Observable<IEmployee>;
    set user$(value: Observable<IUser>);
    get user$(): Observable<IUser>;
    get isSubmit$(): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserMenuComponent, "gauzy-user-menu", never, { "user$": { "alias": "user$"; "required": false; }; }, { "close": "close"; }, never, never, false, never>;
}
