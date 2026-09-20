import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class UserOrganizationsSelectComponent {
    constructor() {
        this.selectedChange = new EventEmitter();
    }
    onOrganizationsSelected(selectEvent) {
        this.selectedChange.emit(selectEvent);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserOrganizationsSelectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: UserOrganizationsSelectComponent, isStandalone: false, selector: "ga-user-organizations-multi-select", inputs: { selectedOrganizationsId: "selectedOrganizationsId", allOrganizations: "allOrganizations" }, outputs: { selectedChange: "selectedChange" }, ngImport: i0, template: "<nb-select\n  multiple\n  [selected]=\"selectedOrganizationsId\"\n  (selectedChange)=\"onOrganizationsSelected($event)\"\n  fullWidth\n  placeholder=\"{{ 'FORM.PLACEHOLDERS.ADD_ORGANIZATIONS' | translate }}\"\n  >\n  @for (organization of allOrganizations; track organization) {\n    <nb-option\n      [value]=\"organization.id\"\n      >\n      <img\n        src=\"{{ organization.imageUrl }}\"\n        alt=\"Smiley face\"\n        height=\"40\"\n        width=\"40\"\n        style=\"margin-right:10px\"\n        />\n        {{ organization.name }}\n      </nb-option>\n    }\n  </nb-select>\n", dependencies: [{ kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserOrganizationsSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-user-organizations-multi-select', standalone: false, template: "<nb-select\n  multiple\n  [selected]=\"selectedOrganizationsId\"\n  (selectedChange)=\"onOrganizationsSelected($event)\"\n  fullWidth\n  placeholder=\"{{ 'FORM.PLACEHOLDERS.ADD_ORGANIZATIONS' | translate }}\"\n  >\n  @for (organization of allOrganizations; track organization) {\n    <nb-option\n      [value]=\"organization.id\"\n      >\n      <img\n        src=\"{{ organization.imageUrl }}\"\n        alt=\"Smiley face\"\n        height=\"40\"\n        width=\"40\"\n        style=\"margin-right:10px\"\n        />\n        {{ organization.name }}\n      </nb-option>\n    }\n  </nb-select>\n" }]
        }], ctorParameters: () => [], propDecorators: { selectedOrganizationsId: [{
                type: Input
            }], allOrganizations: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }] } });
//# sourceMappingURL=user-organizations-multi-select.component.js.map