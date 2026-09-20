import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@gauzy/ui-core/core';
import { CandidatesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { BaseCandidateSelectorComponent } from '../base-candidate-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../../../components/avatar/avatar.component";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
export class CandidateMultiSelectComponent extends BaseCandidateSelectorComponent {
    constructor(store, candidatesService, errorHandlingService) {
        super(store, candidatesService, errorHandlingService);
        this.selectedCandidateIds = [];
        this.selectedChange = new EventEmitter();
    }
    ngOnInit() {
        super.ngOnInit(); // Call the parent class's ngOnInit function
    }
    /**
     *
     * @param candidate
     */
    onCandidateSelected(candidate) {
        this.selectedChange.emit(candidate);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMultiSelectComponent, deps: [{ token: i1.Store }, { token: i1.CandidatesService }, { token: i1.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateMultiSelectComponent, isStandalone: false, selector: "ga-candidate-multi-select", inputs: { selectedCandidateIds: "selectedCandidateIds" }, outputs: { selectedChange: "selectedChange" }, usesInheritance: true, ngImport: i0, template: "<nb-select\n  multiple\n  [selected]=\"selectedCandidateIds\"\n  (selectedChange)=\"onCandidateSelected($event)\"\n  fullWidth\n  [placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_CANDIDATES' | translate\"\n  >\n  @for (candidate of candidates$ | async; track candidate) {\n    <nb-option [value]=\"candidate.id\">\n      <ngx-avatar\n        size=\"sm\"\n        [src]=\"candidate.user?.imageUrl\"\n        [name]=\"candidate.user?.name\"\n        [isOption]=\"true\"\n      ></ngx-avatar>\n    </nb-option>\n  }\n</nb-select>\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}.container{padding:inherit;display:flex;align-items:center;gap:2%}.container input{width:inherit}nb-checkbox{text-wrap:nowrap}\n"], dependencies: [{ kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i3.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMultiSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-multi-select', standalone: false, template: "<nb-select\n  multiple\n  [selected]=\"selectedCandidateIds\"\n  (selectedChange)=\"onCandidateSelected($event)\"\n  fullWidth\n  [placeholder]=\"'FORM.PLACEHOLDERS.ADD_REMOVE_CANDIDATES' | translate\"\n  >\n  @for (candidate of candidates$ | async; track candidate) {\n    <nb-option [value]=\"candidate.id\">\n      <ngx-avatar\n        size=\"sm\"\n        [src]=\"candidate.user?.imageUrl\"\n        [name]=\"candidate.user?.name\"\n        [isOption]=\"true\"\n      ></ngx-avatar>\n    </nb-option>\n  }\n</nb-select>\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}.container{padding:inherit;display:flex;align-items:center;gap:2%}.container input{width:inherit}nb-checkbox{text-wrap:nowrap}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.CandidatesService }, { type: i1.ErrorHandlingService }], propDecorators: { selectedCandidateIds: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }] } });
//# sourceMappingURL=candidate-multi-select.component.js.map