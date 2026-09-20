import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "../../../components/avatar/avatar.component";
let CandidateInterviewerSelectComponent = class CandidateInterviewerSelectComponent {
    constructor() {
        this.select = new FormControl();
        this.interviewers = [];
        this.isAllMembers = false;
        this.disabled = false;
        this.isPlaceholderSelected = false;
        this.selectedChange = new EventEmitter();
    }
    set reset(value) {
        if (value) {
            this.select.reset();
        }
    }
    /**
     *
     * @param candidate
     */
    onInterviewerSelected(candidate) {
        this.selectedChange.emit(candidate);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewerSelectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateInterviewerSelectComponent, isStandalone: false, selector: "ga-candidate-interviewer-select", inputs: { placeholder: "placeholder", disabledIds: "disabledIds", interviewers: "interviewers", isAllMembers: "isAllMembers", disabled: "disabled", isPlaceholderSelected: "isPlaceholderSelected", reset: "reset" }, outputs: { selectedChange: "selectedChange" }, ngImport: i0, template: "<nb-select\n  fullWidth\n  [formControl]=\"select\"\n  (selectedChange)=\"onInterviewerSelected($event)\"\n  [disabled]=\"disabled\"\n  [placeholder]=\"placeholder\"\n  >\n  @if (isAllMembers) {\n    <nb-option value=\"all\">\n      <ngx-avatar size=\"sm\" [src]=\"'https://i.imgur.com/XwA2T62.jpg'\" [name]=\"'All'\" [isOption]=\"true\"></ngx-avatar>\n    </nb-option>\n  }\n  @for (interviewer of interviewers; track interviewer) {\n    <nb-option\n      [value]=\"interviewer.id\"\n      [disabled]=\"disabledIds?.includes(interviewer.id) ? true : false\"\n      >\n      <ngx-avatar\n        size=\"sm\"\n        [src]=\"interviewer.user?.imageUrl\"\n        [name]=\"interviewer.user?.name\"\n        [isOption]=\"true\"\n      ></ngx-avatar>\n    </nb-option>\n  }\n</nb-select>\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}.container{padding:inherit;display:flex;align-items:center;gap:2%}.container input{width:inherit}nb-checkbox{text-wrap:nowrap}\n"], dependencies: [{ kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i3.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }] }); }
};
CandidateInterviewerSelectComponent = __decorate([
    UntilDestroy()
], CandidateInterviewerSelectComponent);
export { CandidateInterviewerSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewerSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-interviewer-select', standalone: false, template: "<nb-select\n  fullWidth\n  [formControl]=\"select\"\n  (selectedChange)=\"onInterviewerSelected($event)\"\n  [disabled]=\"disabled\"\n  [placeholder]=\"placeholder\"\n  >\n  @if (isAllMembers) {\n    <nb-option value=\"all\">\n      <ngx-avatar size=\"sm\" [src]=\"'https://i.imgur.com/XwA2T62.jpg'\" [name]=\"'All'\" [isOption]=\"true\"></ngx-avatar>\n    </nb-option>\n  }\n  @for (interviewer of interviewers; track interviewer) {\n    <nb-option\n      [value]=\"interviewer.id\"\n      [disabled]=\"disabledIds?.includes(interviewer.id) ? true : false\"\n      >\n      <ngx-avatar\n        size=\"sm\"\n        [src]=\"interviewer.user?.imageUrl\"\n        [name]=\"interviewer.user?.name\"\n        [isOption]=\"true\"\n      ></ngx-avatar>\n    </nb-option>\n  }\n</nb-select>\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}.container{padding:inherit;display:flex;align-items:center;gap:2%}.container input{width:inherit}nb-checkbox{text-wrap:nowrap}\n"] }]
        }], propDecorators: { placeholder: [{
                type: Input
            }], disabledIds: [{
                type: Input
            }], interviewers: [{
                type: Input
            }], isAllMembers: [{
                type: Input
            }], disabled: [{
                type: Input
            }], isPlaceholderSelected: [{
                type: Input
            }], reset: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }] } });
//# sourceMappingURL=candidate-interviewer-select.component.js.map