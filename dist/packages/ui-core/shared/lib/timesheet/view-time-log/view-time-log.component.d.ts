import { OnInit, OnDestroy } from '@angular/core';
import { IOrganization, ITimeLog, PermissionsEnum } from '@gauzy/contracts';
import { NbDialogService } from '@nebular/theme';
import { Store, TimeTrackerService, TimesheetService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ViewTimeLogComponent implements OnInit, OnDestroy {
    private readonly nbDialogService;
    private readonly timesheetService;
    private readonly store;
    private readonly timeTrackerService;
    organization: IOrganization;
    PermissionsEnum: typeof PermissionsEnum;
    timeLogs: ITimeLog[];
    callback: CallableFunction;
    close: CallableFunction;
    constructor(nbDialogService: NbDialogService, timesheetService: TimesheetService, store: Store, timeTrackerService: TimeTrackerService);
    ngOnInit(): void;
    openAddByDateProject($event: MouseEvent): void;
    openEdit($event: MouseEvent, timeLog: {
        startedAt: Date;
        stoppedAt: Date;
        projectId: string;
        isRunning: boolean;
    }): void;
    viewLog(timeLog: ITimeLog): void;
    onDeleteConfirm(timeLog: ITimeLog): void;
    checkTimerStatus(): Promise<void>;
    onClose(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewTimeLogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewTimeLogComponent, "ngx-view-time-log", never, { "timeLogs": { "alias": "timeLogs"; "required": false; }; "callback": { "alias": "callback"; "required": false; }; }, { "close": "close"; }, never, never, false, never>;
}
