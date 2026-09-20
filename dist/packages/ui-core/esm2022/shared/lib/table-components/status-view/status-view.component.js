import { Component, Input } from '@angular/core';
import { TaskStatusEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../tasks/task-badge-view/task-badge-view.component";
import * as i3 from "@angular/common";
import * as i4 from "../../pipes/replace.pipe";
export class StatusViewComponent {
    ngOnInit() {
        switch (this.value) {
            case TaskStatusEnum.OPEN:
                this.status = 'basic';
                break;
            case TaskStatusEnum.IN_PROGRESS:
                this.status = 'info';
                break;
            case TaskStatusEnum.READY_FOR_REVIEW:
                this.status = 'info';
                break;
            case TaskStatusEnum.IN_REVIEW:
                this.status = 'info';
                break;
            case TaskStatusEnum.COMPLETED:
                this.status = 'success';
                break;
            case TaskStatusEnum.BLOCKED:
                this.status = 'danger';
                break;
            default:
                this.status = 'basic';
                break;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusViewComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: StatusViewComponent, isStandalone: false, selector: "ngx-status-view", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "@if (rowData?.taskStatus) {\n  <gauzy-task-badge-view [taskBadge]=\"rowData?.taskStatus\"></gauzy-task-badge-view>\n} @else {\n  <nb-badge\n    [status]=\"status\"\n    [text]=\"value | replace : '_' : ' ' | titlecase\"\n    class=\"badge\"\n    position=\"centered\"\n  ></nb-badge>\n}\n", styles: [":host{display:flex}.badge{display:flex;flex-direction:row;justify-content:center;align-items:center;position:relative;width:fit-content;height:var(--gauzy-table-badge-height, 1.25rem);padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem);white-space:nowrap;font-size:var(--gauzy-table-header-font-size, .75rem);font-weight:600;line-height:var(--gauzy-table-header-line-height, .9375rem);letter-spacing:0em;text-align:left}\n"], dependencies: [{ kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i2.TaskBadgeViewComponent, selector: "gauzy-task-badge-view", inputs: ["taskBadge"] }, { kind: "pipe", type: i3.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i4.ReplacePipe, name: "replace" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-status-view', standalone: false, template: "@if (rowData?.taskStatus) {\n  <gauzy-task-badge-view [taskBadge]=\"rowData?.taskStatus\"></gauzy-task-badge-view>\n} @else {\n  <nb-badge\n    [status]=\"status\"\n    [text]=\"value | replace : '_' : ' ' | titlecase\"\n    class=\"badge\"\n    position=\"centered\"\n  ></nb-badge>\n}\n", styles: [":host{display:flex}.badge{display:flex;flex-direction:row;justify-content:center;align-items:center;position:relative;width:fit-content;height:var(--gauzy-table-badge-height, 1.25rem);padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem);white-space:nowrap;font-size:var(--gauzy-table-header-font-size, .75rem);font-weight:600;line-height:var(--gauzy-table-header-line-height, .9375rem);letter-spacing:0em;text-align:left}\n"] }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=status-view.component.js.map