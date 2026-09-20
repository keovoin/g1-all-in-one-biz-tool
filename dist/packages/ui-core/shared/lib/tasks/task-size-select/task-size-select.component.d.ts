import { OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization, IOrganizationProject, ITaskSize } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { TaskSizesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class TaskSizeSelectComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    readonly store: Store;
    readonly taskSizesService: TaskSizesService;
    private readonly toastrService;
    private subject$;
    organization: IOrganization;
    sizes$: BehaviorSubject<ITaskSize[]>;
    /**
     * Default global task sizes
     */
    private _sizes;
    private _projectId;
    get projectId(): IOrganizationProject['id'];
    set projectId(value: IOrganizationProject['id']);
    private _addTag;
    get addTag(): boolean;
    set addTag(value: boolean);
    private _placeholder;
    get placeholder(): string;
    set placeholder(value: string);
    private _size;
    set size(val: ITaskSize);
    get size(): ITaskSize;
    onChange: any;
    onTouched: any;
    onChanged: EventEmitter<ITaskSize>;
    constructor(translateService: TranslateService, store: Store, taskSizesService: TaskSizesService, toastrService: ToastrService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    writeValue(value: ITaskSize): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    selectSize(size: ITaskSize): void;
    /**
     * Get task sizes based organization & project
     */
    getTaskSizes(): void;
    /**
     * Create new size from ng-select tag
     *
     * @param name
     * @returns
     */
    createNew: (name: string) => Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskSizeSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaskSizeSelectComponent, "ga-task-size-select", never, { "projectId": { "alias": "projectId"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
