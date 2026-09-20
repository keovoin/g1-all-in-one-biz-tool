import { AfterViewInit, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ID, IOrganization, ITaskStatus } from '@gauzy/contracts';
import { ErrorHandlingService, Store, TaskStatusesService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class TaskStatusSelectComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _store;
    private readonly _taskStatusesService;
    private readonly _errorHandlingService;
    organization: IOrganization;
    private subject$;
    /**
     * A BehaviorSubject to store and emit the latest list of task statuses.
     */
    statuses$: BehaviorSubject<ITaskStatus[]>;
    /**
     * Predefined task statuses with names and sluggable values.
     */
    private _statuses;
    /**
     * Input properties for component customization.
     *
     * @property addTag - Whether adding new tags is allowed (default: true).
     */
    addTag: boolean;
    /**
     * The placeholder text to be displayed in the project selector.
     * Provides guidance to the user on what action to take or what information to provide.
     *
     */
    placeholder: string | null;
    /**
     * Enables the default selection behavior.
     * When `true`, the component may automatically select a default team upon initialization.
     *
     * @default true
     */
    defaultSelected: boolean;
    private _projectId;
    set projectId(value: ID);
    get projectId(): ID;
    private _status;
    get status(): ITaskStatus;
    set status(val: ITaskStatus);
    /**
     * Callback function to notify changes in the form control.
     */
    private onChange;
    /**
     * Callback function to notify touch events in the form control.
     */
    private onTouched;
    /**
     * EventEmitter to notify when a status is selected or changed.
     */
    onChanged: EventEmitter<ITaskStatus>;
    constructor(translateService: TranslateService, _store: Store, _taskStatusesService: TaskStatusesService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Updates the status value for the component.
     *
     * @param value - The task status to be written to the component.
     */
    writeValue(value: ITaskStatus): void;
    /**
     * Registers a callback function to be called when the status changes.
     *
     * @param fn - The function that is triggered on status change.
     */
    registerOnChange(fn: (status: ITaskStatus) => void): void;
    /**
     * Registers a callback function to be called when the component is touched.
     *
     * @param fn - The function that is triggered when the component is touched.
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Emits the selected status when a task status is chosen.
     *
     * @param status - The selected task status.
     */
    selectStatus(status: ITaskStatus): void;
    /**
     * Retrieves task statuses based on the organization and project.
     * If a project ID is available, it filters statuses accordingly.
     * Emits the list of statuses and sets the default status if none is selected.
     */
    getStatuses(): void;
    /**
     * Sets the default status for the task if no status is currently assigned.
     *
     * This method checks if the `status` property is not set. If it is not set,
     * it looks for the default status in the provided array of statuses.
     * If found, it assigns this default status to the `status` property and triggers
     * the `onChange` callback with the default status.
     *
     * @param statuses - An array of task statuses to search for the default status.
     *                   It should contain objects that implement the `ITaskStatus` interface.
     */
    private setDefaultStatusIfNeeded;
    /**
     * Creates a new task status from the ng-select input.
     *
     * @param name - The name of the new status to be created.
     * @returns A promise that resolves when the status is successfully created.
     */
    createNew: (name: string) => Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskStatusSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaskStatusSelectComponent, "ga-task-status-select", never, { "addTag": { "alias": "addTag"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "defaultSelected": { "alias": "defaultSelected"; "required": false; }; "projectId": { "alias": "projectId"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
