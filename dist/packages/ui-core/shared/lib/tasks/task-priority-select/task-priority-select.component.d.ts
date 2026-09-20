import { AfterViewInit, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization, IOrganizationProject, ITaskPriority } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { TaskPrioritiesService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class TaskPrioritySelectComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    readonly store: Store;
    readonly taskPrioritiesService: TaskPrioritiesService;
    private readonly toastrService;
    private subject$;
    /**
     * Default global task priorities
     */
    private _priorities;
    organization: IOrganization;
    priorities$: BehaviorSubject<ITaskPriority[]>;
    onChanged: EventEmitter<ITaskPriority>;
    constructor(translateService: TranslateService, store: Store, taskPrioritiesService: TaskPrioritiesService, toastrService: ToastrService);
    private _projectId;
    get projectId(): IOrganizationProject['id'];
    set projectId(value: IOrganizationProject['id']);
    private _addTag;
    get addTag(): boolean;
    set addTag(value: boolean);
    private _placeholder;
    get placeholder(): string;
    set placeholder(value: string);
    private _priority;
    get priority(): ITaskPriority;
    set priority(val: ITaskPriority);
    onChange: any;
    onTouched: any;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    writeValue(value: ITaskPriority): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    selectPriority(priority: ITaskPriority): void;
    /**
     * Get task priorities based organization & project
     */
    getTaskPriorities(): void;
    /**
     * Create new priority from ng-select tag
     *
     * @param name
     * @returns
     */
    createNew: (name: string) => Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskPrioritySelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaskPrioritySelectComponent, "ga-task-priority-select", never, { "projectId": { "alias": "projectId"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
