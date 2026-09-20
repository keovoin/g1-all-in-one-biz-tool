import { OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { IEmployee, IScreenshot, ITimeLog, ITimeSlot, PermissionsEnum, TimeFormatEnum } from '@gauzy/contracts';
import { progressStatus } from '@gauzy/ui-core/common';
import { Store, TimesheetService, ToastrService } from '@gauzy/ui-core/core';
import { TimeZoneService } from '../../gauzy-filters/timezone-filter';
import * as i0 from "@angular/core";
export declare class ViewScreenshotsModalComponent implements OnInit {
    private readonly _store;
    private readonly _dialogRef;
    private readonly _timesheetService;
    private readonly _nbDialogService;
    private readonly _toastrService;
    private readonly _timeZoneService;
    progressStatus: typeof progressStatus;
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
    PermissionsEnum: typeof PermissionsEnum;
    private organization;
    private _timeSlot;
    get timeSlot(): ITimeSlot;
    /**
     * Setter for the timeSlot property. Assigns the provided timeSlot value, processes
     * and formats the screenshots, and updates the local _timeSlot property accordingly.
     *
     * @param timeSlot - The TimeSlot object to be assigned.
     */
    set timeSlot(timeSlot: ITimeSlot);
    private _screenshots;
    get screenshots(): IScreenshot[];
    set screenshots(screenshots: IScreenshot[]);
    private _timeLogs;
    get timeLogs(): ITimeLog[];
    set timeLogs(timeLogs: ITimeLog[]);
    /**
     * Array to store unique application names associated with the current time slot.
     * Used in the context of time logs and screenshots.
     */
    apps: string[];
    timeZone$: Observable<string>;
    timeFormat$: Observable<TimeFormatEnum>;
    constructor(_store: Store, _dialogRef: NbDialogRef<ViewScreenshotsModalComponent>, _timesheetService: TimesheetService, _nbDialogService: NbDialogService, _toastrService: ToastrService, _timeZoneService: TimeZoneService);
    ngOnInit(): void;
    /**
     * Asynchronously retrieves and sets the time slot and associated time logs.
     *
     * @returns A Promise that resolves when the operation is complete.
     */
    getTimeSlot(): Promise<void>;
    /**
     * Closes the current dialog.
     */
    close(): void;
    /**
     * Opens a modal to view details of a time log.
     *
     * @param timeLog - The time log to be viewed.
     */
    viewTimeLog(timeLog: ITimeLog): void;
    /**
     * Deletes a specific screenshot associated with an employee.
     *
     * @param screenshot - The screenshot to be deleted.
     * @param employee - The employee associated with the screenshot.
     * @returns void
     */
    deleteImage(screenshot: IScreenshot, employee: IEmployee): Promise<void>;
    /**
     * Deletes a specific time log associated with an employee.
     *
     * @param timeLog - The time log to be deleted.
     * @param employee - The employee associated with the time log.
     * @returns void
     */
    deleteTimeLog(timeLog: ITimeLog, employee: IEmployee): Promise<void>;
    /**
     * Extracts unique applications from an array of screenshots,
     * handling the possibility of 'apps' being a string or an array.
     *
     * @returns An array containing unique application names.
     */
    getScreenshotUniqueApps(): string[];
    /**
     * Parses a string representation of applications as JSON,
     * returning the parsed array or an empty array if parsing fails.
     *
     * @param apps The string or array representation of applications.
     * @returns An array of application names.
     * @private
     */
    private parseApps;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewScreenshotsModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewScreenshotsModalComponent, "ngx-view-screenshots-modal", never, { "timeSlot": { "alias": "timeSlot"; "required": false; }; "timeLogs": { "alias": "timeLogs"; "required": false; }; }, {}, never, never, false, never>;
}
