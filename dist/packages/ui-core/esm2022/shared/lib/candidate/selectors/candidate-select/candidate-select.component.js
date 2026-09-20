import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Store } from '@gauzy/ui-core/core';
import { CandidatesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { BaseCandidateSelectorComponent } from '../base-candidate-selector.component';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "../../../components/avatar/avatar.component";
import * as i5 from "@angular/common";
import * as i6 from "@ngx-translate/core";
let CandidateSelectComponent = class CandidateSelectComponent extends BaseCandidateSelectorComponent {
    set reset(value) {
        if (value) {
            this.select.reset();
            this.searchControl.setValue(''); // Clear the search input as well
        }
    }
    constructor(store, candidatesService, errorHandlingService) {
        super(store, candidatesService, errorHandlingService);
        this.select = new FormControl();
        this.showRejected = false;
        this.searchControl = new FormControl();
        this.candidatesMap = new Map();
        this.disabled = false;
        this.selectedChange = new EventEmitter();
    }
    ngOnInit() {
        super.ngOnInit(); // Call the parent class's ngOnInit function
        this.filteredCandidates$ = this.searchControl.valueChanges.pipe(startWith(''), switchMap((term) => this.candidates$.pipe(map((candidates) => {
            this.candidatesMap.clear(); // Clear previous candidates map
            candidates.forEach((candidate) => this.candidatesMap.set(candidate.id, candidate));
            return this.filterCandidatesList(candidates, term);
        }))));
    }
    filterCandidatesList(candidates, term) {
        const lowerTerm = term.toLowerCase();
        return candidates.filter((candidate) => candidate.user?.name.toLowerCase().includes(lowerTerm));
    }
    /**
     *
     * @param candidate
     */
    onCandidateSelected(candidateId) {
        const selectedCandidate = this.candidatesMap.get(candidateId);
        if (selectedCandidate) {
            this.searchControl.setValue(selectedCandidate.user?.name || '');
            this.selectedChange.emit(candidateId);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateSelectComponent, deps: [{ token: i1.Store }, { token: i1.CandidatesService }, { token: i1.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateSelectComponent, isStandalone: false, selector: "ga-candidate-select", inputs: { placeholder: "placeholder", disabled: "disabled", reset: "reset" }, outputs: { selectedChange: "selectedChange" }, viewQueries: [{ propertyName: "input", first: true, predicate: ["autoInput"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"container\">\n  <input\n    #autoInput\n    nbInput\n    type=\"text\"\n    [formControl]=\"searchControl\"\n    placeholder=\"Add candidate\"\n    [nbAutocomplete]=\"auto\"\n    />\n\n    <nb-autocomplete #auto (selectedChange)=\"onCandidateSelected($event)\">\n      @for (candidate of filteredCandidates$ | async; track candidate) {\n        <nb-option [value]=\"candidate.id\">\n          <ngx-avatar\n            size=\"sm\"\n            [src]=\"candidate.user?.imageUrl\"\n            [name]=\"candidate.user?.name\"\n            [isOption]=\"true\"\n          ></ngx-avatar>\n        </nb-option>\n      }\n    </nb-autocomplete>\n\n    <nb-checkbox [(ngModel)]=\"showRejected\" class=\"checkbox\" (ngModelChange)=\"toggleShowRejected()\">\n      {{ 'CANDIDATES_PAGE.SHOW_REJECTED' | translate }}\n    </nb-checkbox>\n  </div>\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}.container{padding:inherit;display:flex;align-items:center;gap:2%}.container input{width:inherit}nb-checkbox{text-wrap:nowrap}\n"], dependencies: [{ kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i3.NbAutocompleteComponent, selector: "nb-autocomplete", inputs: ["handleDisplayFn", "size", "activeFirst", "optionsListClass", "optionsPanelClass", "optionsWidth"], outputs: ["selectedChange"] }, { kind: "directive", type: i3.NbAutocompleteDirective, selector: "input[nbAutocomplete]", inputs: ["nbAutocomplete", "overlayOffset", "scrollStrategy", "customOverlayHost"] }, { kind: "component", type: i4.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
};
CandidateSelectComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [Store, CandidatesService, ErrorHandlingService])
], CandidateSelectComponent);
export { CandidateSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-select', standalone: false, template: "<div class=\"container\">\n  <input\n    #autoInput\n    nbInput\n    type=\"text\"\n    [formControl]=\"searchControl\"\n    placeholder=\"Add candidate\"\n    [nbAutocomplete]=\"auto\"\n    />\n\n    <nb-autocomplete #auto (selectedChange)=\"onCandidateSelected($event)\">\n      @for (candidate of filteredCandidates$ | async; track candidate) {\n        <nb-option [value]=\"candidate.id\">\n          <ngx-avatar\n            size=\"sm\"\n            [src]=\"candidate.user?.imageUrl\"\n            [name]=\"candidate.user?.name\"\n            [isOption]=\"true\"\n          ></ngx-avatar>\n        </nb-option>\n      }\n    </nb-autocomplete>\n\n    <nb-checkbox [(ngModel)]=\"showRejected\" class=\"checkbox\" (ngModelChange)=\"toggleShowRejected()\">\n      {{ 'CANDIDATES_PAGE.SHOW_REJECTED' | translate }}\n    </nb-checkbox>\n  </div>\n", styles: [":host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:nowrap;overflow:hidden}ngx-avatar ::ng-deep .inner-wrapper{display:flex;flex-direction:row}ngx-avatar ::ng-deep .inner-wrapper .names-wrapper{margin:0 10px}.container{padding:inherit;display:flex;align-items:center;gap:2%}.container input{width:inherit}nb-checkbox{text-wrap:nowrap}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.CandidatesService }, { type: i1.ErrorHandlingService }], propDecorators: { placeholder: [{
                type: Input
            }], disabled: [{
                type: Input
            }], reset: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], input: [{
                type: ViewChild,
                args: ['autoInput']
            }] } });
//# sourceMappingURL=candidate-select.component.js.map