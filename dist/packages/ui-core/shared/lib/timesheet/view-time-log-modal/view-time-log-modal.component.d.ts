import { OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ITimeLog, PermissionsEnum, IOrganization } from '@gauzy/contracts';
import { Store, TimeTrackerService, TimesheetService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ViewTimeLogModalComponent implements OnInit, OnDestroy {
    private readonly timesheetService;
    private readonly nbDialogService;
    private readonly dialogRef;
    private readonly store;
    private readonly timeTrackerService;
    private readonly router;
    organization: IOrganization;
    PermissionsEnum: typeof PermissionsEnum;
    TimeLogsLabel: {
        TRACKED: {
            status: string;
            text: import("@gauzy/contracts").TimeLogType;
        };
        MANUAL: {
            status: string;
            text: import("@gauzy/contracts").TimeLogType;
        };
        RESUMED: {
            status: string;
            text: import("@gauzy/contracts").TimeLogType;
        };
        IDLE: {
            status: string;
            text: import("@gauzy/contracts").TimeLogType;
        };
    };
    timeLog: ITimeLog;
    constructor(timesheetService: TimesheetService, nbDialogService: NbDialogService, dialogRef: NbDialogRef<ViewTimeLogModalComponent>, store: Store, timeTrackerService: TimeTrackerService, router: Router);
    ngOnInit(): void;
    openDialog(): void;
    close(): void;
    onDeleteConfirm(): void;
    checkTimerStatus(): Promise<void>;
    redirectToClient(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewTimeLogModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewTimeLogModalComponent, "ngx-view-time-log-modal", never, { "timeLog": { "alias": "timeLog"; "required": false; }; }, {}, never, never, false, never>;
}
