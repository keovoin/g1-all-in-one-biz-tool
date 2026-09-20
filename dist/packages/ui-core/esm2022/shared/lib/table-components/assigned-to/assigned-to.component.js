import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../employee-with-links/employee-with-links.component";
import * as i2 from "../task-teams/task-teams.component";
export class AssignedToComponent {
    ngOnInit() {
        if (this.rowData) {
            if (this.rowData.members && this.rowData.members.length > 0) {
                this.view = 'members';
                this.value = [...this.rowData.members];
            }
            else if (this.rowData.teams && this.rowData.teams.length > 0) {
                this.view = 'teams';
                this.value = this._getTeamNames(this.rowData);
            }
        }
    }
    /**
     * Extracts an array of team names from the given task.
     * @param task The task object.
     * @returns An array of team names.
     */
    _getTeamNames(task) {
        if (task?.teams && Array.isArray(task.teams)) {
            return task.teams.map((team) => team.name);
        }
        return [];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AssignedToComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: AssignedToComponent, isStandalone: false, selector: "ngx-assigned-to", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: "@if (value) {\n  @if (view === 'members') {\n    <ngx-employee-with-links [value]=\"value\"></ngx-employee-with-links>\n  }\n  @if (view === 'teams') {\n    <ngx-task-teams [value]=\"value\"></ngx-task-teams>\n  }\n}\n", dependencies: [{ kind: "component", type: i1.EmployeeWithLinksComponent, selector: "ngx-employee-with-links", inputs: ["rowData", "value"] }, { kind: "component", type: i2.TaskTeamsComponent, selector: "ngx-task-teams", inputs: ["rowData", "value"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AssignedToComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-assigned-to', standalone: false, template: "@if (value) {\n  @if (view === 'members') {\n    <ngx-employee-with-links [value]=\"value\"></ngx-employee-with-links>\n  }\n  @if (view === 'teams') {\n    <ngx-task-teams [value]=\"value\"></ngx-task-teams>\n  }\n}\n" }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=assigned-to.component.js.map