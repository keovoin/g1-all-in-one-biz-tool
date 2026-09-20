import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class UserSelectComponent {
    constructor() {
        this.selectedChange = new EventEmitter();
    }
    onMembersSelected(selectEvent) {
        this.selectedChange.emit(selectEvent);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserSelectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: UserSelectComponent, isStandalone: false, selector: "ga-user-multi-select", inputs: { selectedUserIds: "selectedUserIds", allUsers: "allUsers" }, outputs: { selectedChange: "selectedChange" }, ngImport: i0, template: "<nb-select\n  multiple\n  [selected]=\"selectedUserIds\"\n  (selectedChange)=\"onMembersSelected($event)\"\n  fullWidth\n  placeholder=\"{{ 'FORM.PLACEHOLDERS.ADD_REMOVE_USERS' | translate }}\"\n  >\n  @for (user of allUsers; track user) {\n    <nb-option [value]=\"user.id\">\n      <img\n        src=\"{{ user.imageUrl }}\"\n        alt=\"Smiley face\"\n        height=\"40\"\n        width=\"40\"\n        style=\"margin-right:10px\"\n        />\n        {{ user.firstName }}\n        {{ user.lastName }}\n      </nb-option>\n    }\n  </nb-select>\n", dependencies: [{ kind: "component", type: i1.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i1.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-user-multi-select', standalone: false, template: "<nb-select\n  multiple\n  [selected]=\"selectedUserIds\"\n  (selectedChange)=\"onMembersSelected($event)\"\n  fullWidth\n  placeholder=\"{{ 'FORM.PLACEHOLDERS.ADD_REMOVE_USERS' | translate }}\"\n  >\n  @for (user of allUsers; track user) {\n    <nb-option [value]=\"user.id\">\n      <img\n        src=\"{{ user.imageUrl }}\"\n        alt=\"Smiley face\"\n        height=\"40\"\n        width=\"40\"\n        style=\"margin-right:10px\"\n        />\n        {{ user.firstName }}\n        {{ user.lastName }}\n      </nb-option>\n    }\n  </nb-select>\n" }]
        }], ctorParameters: () => [], propDecorators: { selectedUserIds: [{
                type: Input
            }], allUsers: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }] } });
//# sourceMappingURL=user-multi-select.component.js.map