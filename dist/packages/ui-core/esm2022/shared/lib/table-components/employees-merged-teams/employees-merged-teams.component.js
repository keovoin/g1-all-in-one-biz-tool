import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../employee-with-links/employee-with-links.component";
import * as i3 from "../task-teams/task-teams.component";
export class EmployeesMergedTeamsComponent {
    constructor() {
        this.employees = [];
    }
    ngOnInit() {
        if (this.value) {
            const buffers = this.value[1];
            if (buffers) {
                for (let buffer of buffers) {
                    for (let member of buffer.members) {
                        this.employees.push(member.employee);
                    }
                }
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeesMergedTeamsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeesMergedTeamsComponent, isStandalone: false, selector: "ngx-employees-merged-teams", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<div>\n  <ng-container>\n    <ng-template\n      [ngTemplateOutlet]=\"value[0]?.length > 0 ? employeesLink : teams\"\n    ></ng-template>\n  </ng-container>\n</div>\n\n<ng-template #teams>\n  @if (employees) {\n    <ngx-employee-with-links\n      [value]=\"employees\"\n    ></ngx-employee-with-links>\n  }\n  <ngx-task-teams [value]=\"value[1]\"></ngx-task-teams>\n</ng-template>\n<ng-template #employeesLink>\n  <ngx-employee-with-links [value]=\"value[0]\"></ngx-employee-with-links>\n</ng-template>\n", styles: [":host>div{display:flex;flex-direction:column;align-items:flex-start;gap:var(--gauzy-people-stack-gap);min-width:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.EmployeeWithLinksComponent, selector: "ngx-employee-with-links", inputs: ["rowData", "value"] }, { kind: "component", type: i3.TaskTeamsComponent, selector: "ngx-task-teams", inputs: ["rowData", "value"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeesMergedTeamsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-employees-merged-teams', standalone: false, template: "<div>\n  <ng-container>\n    <ng-template\n      [ngTemplateOutlet]=\"value[0]?.length > 0 ? employeesLink : teams\"\n    ></ng-template>\n  </ng-container>\n</div>\n\n<ng-template #teams>\n  @if (employees) {\n    <ngx-employee-with-links\n      [value]=\"employees\"\n    ></ngx-employee-with-links>\n  }\n  <ngx-task-teams [value]=\"value[1]\"></ngx-task-teams>\n</ng-template>\n<ng-template #employeesLink>\n  <ngx-employee-with-links [value]=\"value[0]\"></ngx-employee-with-links>\n</ng-template>\n", styles: [":host>div{display:flex;flex-direction:column;align-items:flex-start;gap:var(--gauzy-people-stack-gap);min-width:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=employees-merged-teams.component.js.map