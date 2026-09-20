import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../project-organization/project-organization.component";
import * as i2 from "../visibility/visibility.component";
export class ProjectOrganizationGridComponent {
    constructor() {
        this._rowData = null;
        this._visibility$ = new BehaviorSubject(null);
    }
    onVisibilityChange(state) {
        this._visibility$.next(state);
    }
    get visibility() {
        if (this._visibility$.getValue() === null) {
            this._visibility$.next(this.rowData.public === null ? false : this.rowData.public);
        }
        return this._visibility$.getValue();
    }
    set rowData(value) {
        if (value) {
            this._rowData = value;
        }
    }
    get rowData() {
        return this._rowData;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectOrganizationGridComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProjectOrganizationGridComponent, isStandalone: false, selector: "gauzy-project-organization-grid", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<div class=\"d-flex justify-content-between\">\n\t<gauzy-project-organization [rowData]=\"rowData\" ></gauzy-project-organization>\n\t<gauzy-visibility (visibilityChange)=\"onVisibilityChange($event)\" [rowData]=\"rowData\"></gauzy-visibility>\n</div>\n", styles: [""], dependencies: [{ kind: "component", type: i1.ProjectOrganizationComponent, selector: "gauzy-project-organization", inputs: ["value", "rowData"] }, { kind: "component", type: i2.VisibilityComponent, selector: "gauzy-visibility", inputs: ["value", "rowData"], outputs: ["visibilityChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectOrganizationGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-project-organization-grid', standalone: false, template: "<div class=\"d-flex justify-content-between\">\n\t<gauzy-project-organization [rowData]=\"rowData\" ></gauzy-project-organization>\n\t<gauzy-visibility (visibilityChange)=\"onVisibilityChange($event)\" [rowData]=\"rowData\"></gauzy-visibility>\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=project-organization-grid.component.js.map