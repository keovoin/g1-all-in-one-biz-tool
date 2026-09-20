import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { ITaskStatus } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class TaskStatusFilterComponent extends DefaultFilter implements OnChanges {
    constructor();
    /**
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     *
     * @param value
     */
    onChange(value: ITaskStatus | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskStatusFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaskStatusFilterComponent, "ga-task-status-select-filter", never, {}, {}, never, never, false, never>;
}
