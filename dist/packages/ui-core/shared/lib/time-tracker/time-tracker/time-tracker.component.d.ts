import { OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxDraggableDomMoveEvent, NgxDraggablePoint } from 'ngx-draggable-dom';
import { NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { Environment } from '@gauzy/ui-config';
import { IOrganization, IUser, IDateRange, TimeLogType, PermissionsEnum, IEmployee } from '@gauzy/contracts';
import { ErrorHandlingService, Store, TimeTrackerService, TimesheetService, ToastrService } from '@gauzy/ui-core/core';
import { TimeTrackerStatusService } from '../components/time-tracker-status/time-tracker-status.service';
import * as i0 from "@angular/core";
export declare class TimeTrackerComponent implements OnInit, OnDestroy {
    private readonly timeTrackerService;
    private readonly timesheetService;
    private readonly toastrService;
    private readonly store;
    private readonly _errorHandlingService;
    private readonly themeService;
    private readonly ngxPermissionsService;
    private readonly _timeTrackerStatusService;
    readonly PLATFORM_WEBSITE_DOWNLOAD_URL: Environment['PLATFORM_WEBSITE_DOWNLOAD_URL'];
    play: import("@fortawesome/fontawesome-common-types").IconDefinition;
    pause: import("@fortawesome/fontawesome-common-types").IconDefinition;
    stopwatch: import("@fortawesome/fontawesome-common-types").IconDefinition;
    isDisable: boolean;
    isOpen: boolean;
    isExpanded: boolean;
    futureDateAllowed: IOrganization['futureDateAllowed'];
    todaySessionTime: string;
    currentSessionTime: string;
    running: boolean;
    today: Date;
    selectedRange: IDateRange;
    user: IUser;
    employee: IEmployee;
    organization: IOrganization;
    PermissionsEnum: typeof PermissionsEnum;
    timeLogType: typeof TimeLogType;
    hideAlert: boolean;
    form: NgForm;
    trackType$: Observable<string>;
    theme: string;
    constructor(timeTrackerService: TimeTrackerService, timesheetService: TimesheetService, toastrService: ToastrService, store: Store, _errorHandlingService: ErrorHandlingService, themeService: NbThemeService, ngxPermissionsService: NgxPermissionsService, _timeTrackerStatusService: TimeTrackerStatusService);
    /**
     * Gets the value indicating whether the task is billable.
     *
     * @returns A boolean indicating if the task is billable.
     */
    get isBillable(): boolean;
    /**
     * Sets the value indicating whether the task is billable.
     *
     * @param value - A boolean indicating if the task should be billable.
     */
    set isBillable(value: boolean);
    /**
     * Gets the current task ID associated with the timer configuration.
     *
     * @returns The task ID if it exists and is a string; otherwise, null.
     */
    get taskId(): string | null;
    /**
     * Sets the task ID for the timer configuration.
     *
     * @param value - The task ID to set.
     */
    set taskId(value: string);
    /**
     * Gets the organization contact ID from the timer configuration.
     *
     * @returns The organization contact ID if it exists and is a string; otherwise, null.
     */
    get organizationContactId(): string | null;
    /**
     * Sets the organization contact ID for the timer configuration.
     *
     * @param value - The organization contact ID to set.
     */
    set organizationContactId(value: string);
    /**
     * Gets the project ID associated with the timer configuration.
     *
     * @returns The project ID if it exists and is a string; otherwise, null.
     */
    get projectId(): string | null;
    /**
     * Sets the project ID for the timer configuration.
     *
     * @param value - The project ID to set.
     */
    set projectId(value: string);
    /**
     * Gets the organization team ID associated with the timer configuration.
     *
     * @returns The organization team ID if it exists and is a string; otherwise, null.
     */
    get organizationTeamId(): string | null;
    /**
     * Sets the organization team ID for the timer configuration.
     *
     * @param value - The organization team ID to set.
     */
    set organizationTeamId(value: string);
    /**
     * Gets the description from the timer configuration.
     *
     * @returns The description if it exists and is a string; otherwise, null.
     */
    get description(): string | null;
    /**
     * Sets the description for the timer configuration.
     *
     * @param value - The description to set.
     */
    set description(value: string);
    /**
     * Updates the timer configuration with new values.
     *
     * @param updates - An object containing the properties to update in the timer configuration.
     */
    private updateTimerConfig;
    /**
     * Retrieves the value of a specified string property from the timer configuration.
     *
     * @param key - The name of the property to retrieve.
     * @returns The value of the property if it exists and is a string; otherwise, null.
     */
    private getStringConfigValue;
    /**
     * Gets the current position of the timer.
     *
     * @returns The current position or offset of the timer.
     */
    get position(): NgxDraggablePoint;
    /**
     * Sets the position of the timer.
     *
     * @param offSet - The offset value to set for the timer's position.
     */
    set position(offSet: NgxDraggablePoint);
    ngOnInit(): void;
    toggleWindow(): void;
    show(): void;
    hide(): void;
    toggleTimer(onClick?: boolean): Promise<void>;
    addTime(): Promise<void>;
    setTimeType(type: string): void;
    /**
     * Draggable Web Timer Position
     *
     * @param event
     */
    draggablePosition(event: NgxDraggableDomMoveEvent): void;
    xor(a: boolean, b: boolean): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeTrackerComponent, "ngx-web-time-tracker", never, {}, {}, never, never, false, never>;
}
