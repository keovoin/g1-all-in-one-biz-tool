import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment as ENV } from '@gauzy/ui-config';
import { KeyResultTypeEnum, KeyResultNumberUnitsEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@angular/forms";
import * as i4 from "../../modules/currency/currency.component";
import * as i5 from "@ngx-translate/core";
let GoalCustomUnitSelectComponent = class GoalCustomUnitSelectComponent {
    constructor(store) {
        this.store = store;
        this.keyResultTypeEnum = KeyResultTypeEnum;
        this.createNew = false;
    }
    ngOnInit() {
        this.defaultCurrency = this.store.selectedOrganization.currency;
        this.parentFormGroup.controls['type'].valueChanges.pipe(untilDestroyed(this)).subscribe((formValue) => {
            if (formValue === KeyResultTypeEnum.CURRENCY) {
                this.parentFormGroup.controls['unit'].patchValue(this.defaultCurrency || ENV.DEFAULT_CURRENCY);
            }
            else if (formValue === KeyResultTypeEnum.NUMERICAL) {
                this.parentFormGroup.controls['unit'].patchValue(KeyResultNumberUnitsEnum.ITEMS);
            }
        });
    }
    createNewUnit() {
        if (this.parentFormGroup.value.unit !== ' ') {
            this.numberUnits.push(this.parentFormGroup.value.unit);
        }
        this.createNew = false;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalCustomUnitSelectComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GoalCustomUnitSelectComponent, isStandalone: false, selector: "ga-goal-custom-unit-select", inputs: { parentFormGroup: "parentFormGroup", numberUnits: "numberUnits" }, ngImport: i0, template: "<div [formGroup]=\"parentFormGroup\">\n  @if (parentFormGroup.value.type == keyResultTypeEnum.CURRENCY) {\n    @if (parentFormGroup.value.type == keyResultTypeEnum.CURRENCY) {\n      <ga-currency\n        formControlName=\"unit\"\n        [placeholder]=\"'Unit'\"\n      ></ga-currency>\n    }\n  } @else {\n    <label for=\"unit\" class=\"label\">\n      {{ 'FORM.LABELS.UNIT' | translate }}\n    </label>\n    @if (\n      parentFormGroup.value.type == keyResultTypeEnum.NUMERICAL &&\n      !createNew\n      ) {\n      <nb-select\n        fullWidth\n        formControlName=\"unit\"\n        [selected]=\"numberUnits[0]\"\n\t\t\t(selectedChange)=\"\n\t\t\t\tparentFormGroup.value.unit == 'create-new'\n\t\t\t\t\t? (createNew = !createNew)\n\t\t\t\t\t: true\n\t\t\t\"\n        id=\"unit\"\n        nbSuffix\n        >\n        @for (unit of numberUnits; track unit) {\n          <nb-option [value]=\"unit\">\n            {{ unit }}\n          </nb-option>\n        }\n        <nb-option value=\"create-new\" class=\"bg-secondary text-light\">\n          {{ 'GOALS_PAGE.CREATE_NEW' | translate }}\n        </nb-option>\n      </nb-select>\n    }\n  }\n  @if (createNew) {\n    <nb-form-field>\n      <input type=\"text\" formControlName=\"unit\" nbInput fullWidth />\n      <nb-icon\n        nbSuffix\n        icon=\"checkmark-outline\"\n        status=\"success\"\n        (click)=\"createNewUnit()\"\n        >\n      </nb-icon>\n      <nb-icon\n        nbSuffix\n        icon=\"close-outline\"\n        status=\"danger\"\n        (click)=\"createNew = !createNew\"\n        >\n      </nb-icon>\n    </nb-form-field>\n  }\n</div>\n", styles: [""], dependencies: [{ kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i2.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "directive", type: i2.NbSuffixDirective, selector: "[nbSuffix]" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i4.CurrencyComponent, selector: "ga-currency", inputs: ["formControl", "currency", "placeholder", "label"], outputs: ["optionChange"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
GoalCustomUnitSelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store])
], GoalCustomUnitSelectComponent);
export { GoalCustomUnitSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalCustomUnitSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-goal-custom-unit-select', standalone: false, template: "<div [formGroup]=\"parentFormGroup\">\n  @if (parentFormGroup.value.type == keyResultTypeEnum.CURRENCY) {\n    @if (parentFormGroup.value.type == keyResultTypeEnum.CURRENCY) {\n      <ga-currency\n        formControlName=\"unit\"\n        [placeholder]=\"'Unit'\"\n      ></ga-currency>\n    }\n  } @else {\n    <label for=\"unit\" class=\"label\">\n      {{ 'FORM.LABELS.UNIT' | translate }}\n    </label>\n    @if (\n      parentFormGroup.value.type == keyResultTypeEnum.NUMERICAL &&\n      !createNew\n      ) {\n      <nb-select\n        fullWidth\n        formControlName=\"unit\"\n        [selected]=\"numberUnits[0]\"\n\t\t\t(selectedChange)=\"\n\t\t\t\tparentFormGroup.value.unit == 'create-new'\n\t\t\t\t\t? (createNew = !createNew)\n\t\t\t\t\t: true\n\t\t\t\"\n        id=\"unit\"\n        nbSuffix\n        >\n        @for (unit of numberUnits; track unit) {\n          <nb-option [value]=\"unit\">\n            {{ unit }}\n          </nb-option>\n        }\n        <nb-option value=\"create-new\" class=\"bg-secondary text-light\">\n          {{ 'GOALS_PAGE.CREATE_NEW' | translate }}\n        </nb-option>\n      </nb-select>\n    }\n  }\n  @if (createNew) {\n    <nb-form-field>\n      <input type=\"text\" formControlName=\"unit\" nbInput fullWidth />\n      <nb-icon\n        nbSuffix\n        icon=\"checkmark-outline\"\n        status=\"success\"\n        (click)=\"createNewUnit()\"\n        >\n      </nb-icon>\n      <nb-icon\n        nbSuffix\n        icon=\"close-outline\"\n        status=\"danger\"\n        (click)=\"createNew = !createNew\"\n        >\n      </nb-icon>\n    </nb-form-field>\n  }\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { parentFormGroup: [{
                type: Input
            }], numberUnits: [{
                type: Input
            }] } });
//# sourceMappingURL=goal-custom-unit-select.component.js.map