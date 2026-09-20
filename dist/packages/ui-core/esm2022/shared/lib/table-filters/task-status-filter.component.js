import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "../tasks/task-status-select/task-status-select.component";
import * as i2 from "@ngx-translate/core";
export class TaskStatusFilterComponent extends DefaultFilter {
    constructor() {
        super();
    }
    /**
     *
     * @param changes
     */
    ngOnChanges(changes) { }
    /**
     *
     * @param value
     */
    onChange(value) {
        this.column.filterFunction(value, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TaskStatusFilterComponent, isStandalone: false, selector: "ga-task-status-select-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ga-task-status-select
			[defaultSelected]="false"
			[addTag]="false"
			[placeholder]="'TASKS_PAGE.TASKS_STATUS' | translate"
			(onChanged)="onChange($event)"
		></ga-task-status-select>
	`, isInline: true, dependencies: [{ kind: "component", type: i1.TaskStatusSelectComponent, selector: "ga-task-status-select", inputs: ["addTag", "placeholder", "defaultSelected", "projectId"], outputs: ["onChanged"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TaskStatusFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-task-status-select-filter',
                    template: `
		<ga-task-status-select
			[defaultSelected]="false"
			[addTag]="false"
			[placeholder]="'TASKS_PAGE.TASKS_STATUS' | translate"
			(onChanged)="onChange($event)"
		></ga-task-status-select>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=task-status-filter.component.js.map