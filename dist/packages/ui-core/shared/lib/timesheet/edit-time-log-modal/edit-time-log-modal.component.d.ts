import { OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';
import { IDateRange, IOrganization, ITimeLog, PermissionsEnum, ISelectedEmployee } from '@gauzy/contracts';
import { Store, TimesheetService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class EditTimeLogModalComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly _fb;
    private readonly _cdr;
    private readonly _dialogRef;
    private readonly _store;
    private readonly _timesheetService;
    private readonly _toastrService;
    PermissionsEnum: typeof PermissionsEnum;
    organization: IOrganization;
    today: Date;
    mode: 'create' | 'update';
    loading: boolean;
    overlaps: ITimeLog[];
    selectedRange: IDateRange;
    timeDiff: Date;
    employee: ISelectedEmployee;
    futureDateAllowed: boolean;
    subject$: Subject<any>;
    reasons: string[];
    selectedReason: string;
    private _timeLog;
    set timeLog(value: ITimeLog | Partial<ITimeLog>);
    get timeLog(): ITimeLog | Partial<ITimeLog>;
    form: FormGroup;
    static buildForm(fb: FormBuilder, self: EditTimeLogModalComponent): FormGroup;
    constructor(_fb: FormBuilder, _cdr: ChangeDetectorRef, _dialogRef: NbDialogRef<EditTimeLogModalComponent>, _store: Store, _timesheetService: TimesheetService, _toastrService: ToastrService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Populates the form with time log data.
     *
     * @param {ITimeLog} timeLog - The time log object containing data to set in the form.
     * @returns {void}
     */
    private populateFormWithTimeLog;
    /**
     * Closes the dialog or modal window.
     *
     * - Closes the currently active dialog by passing a `null` result to indicate
     *   that no action or result needs to be returned.
     *
     * @returns {void}
     */
    close(): void;
    /**
     * Checks for overlapping time logs for a selected employee and time range.
     *
     * - Retrieves the form data and organization details, then sends a request to check for overlaps.
     * - Calculates the overlap duration between time logs and maps the result.
     * - Displays any errors using the toastr service.
     *
     * @returns {Promise<void>} - Resolves when the overlaps are checked.
     */
    checkOverlaps(): Promise<void>;
    /**
     * Calculates the overlap duration between two date ranges.
     *
     * @param {Date} timeLogStart - Start date of the existing time log.
     * @param {Date} timeLogEnd - End date of the existing time log.
     * @param {string} selectedStart - Start date of the selected range.
     * @param {string} selectedEnd - End date of the selected range.
     * @returns {number} - Duration of the overlap in seconds.
     */
    private calculateOverlapDuration;
    /**
     * Adds or updates a time log based on the current mode ('create' or 'update').
     *
     * - Validates the form, constructs the payload with the necessary details, and
     *   interacts with the timesheet service to add or update the time log.
     * - Resets the form and displays appropriate success or error messages.
     *
     * @returns {Promise<void>} - Resolves after the time log is added or updated.
     */
    addTime(): Promise<void>;
    /**
     * Confirms and deletes a time log if it is not currently running.
     *
     * @param timeLog - The time log object that needs to be deleted.
     * @returns void - Exits early if the time log is still running.
     */
    onDeleteConfirm(timeLog: ITimeLog): Promise<void>;
    /**
     * Retrieves the value of a form control by its name.
     *
     * @param control - The name of the form control whose value is to be retrieved.
     * @returns string - The value of the form control. If the control is not found or the value is null, an empty string is returned.
     */
    getControlValue(control: string): string;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditTimeLogModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EditTimeLogModalComponent, "ngx-edit-time-log-modal", never, { "timeLog": { "alias": "timeLog"; "required": false; }; }, {}, never, never, false, never>;
}
