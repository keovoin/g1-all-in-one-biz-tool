import { OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { IOrganization, ITask } from '@gauzy/contracts';
import { AuthService, Store, TasksService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class TaskSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
    private readonly tasksService;
    private readonly toastrService;
    private readonly store;
    private readonly authService;
    /**
     * Prompt shown while nothing is selected. Left null so the template keeps
     * falling back to the generic "Task", for the call sites that render the
     * selector without a label of its own.
     */
    placeholder: string | null;
    private _multiple;
    get multiple(): boolean;
    set multiple(value: boolean);
    _disabled: boolean;
    get disabled(): boolean;
    set disabled(value: boolean);
    _addTag: boolean;
    get addTag(): boolean;
    set addTag(value: boolean);
    private _projectId;
    get projectId(): string;
    set projectId(value: string);
    private _employeeId;
    get employeeId(): string;
    set employeeId(value: string);
    private _taskId;
    get taskId(): string;
    set taskId(value: string);
    organization: IOrganization;
    hasPermissionAddTask$: Observable<boolean>;
    tasks: ITask[];
    subject$: Subject<any>;
    constructor(tasksService: TasksService, toastrService: ToastrService, store: Store, authService: AuthService);
    onChange: any;
    onTouched: any;
    ngOnInit(): void;
    writeValue(value: any): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    /**
     * Creates a new task with the given title.
     * @param {string} title - The title of the new task.
     * @returns {Promise<void>} - A Promise that resolves when the task is created.
     */
    createNew: (title: ITask["title"]) => Promise<void>;
    /**
     * Retrieves tasks based on organization, employee, and project.
     * @returns {Promise<void>} - A Promise that resolves when tasks are retrieved.
     */
    getTasks(): Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaskSelectorComponent, "ga-task-selector", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; "projectId": { "alias": "projectId"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; }, {}, never, never, false, never>;
}
