var EmployeeRatesComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { PayPeriodEnum } from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, tap } from 'rxjs';
import { Store } from '@gauzy/ui-core/core';
import { CandidateStore, EmployeeStore } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
import * as i4 from "../../modules/currency/currency.component";
import * as i5 from "@angular/common";
import * as i6 from "@ngx-translate/core";
import * as i7 from "../../pipes/replace.pipe";
let EmployeeRatesComponent = class EmployeeRatesComponent {
    static { EmployeeRatesComponent_1 = this; }
    static buildForm(fb) {
        return fb.group({
            payPeriod: [],
            billRateValue: ['', Validators.min(0)],
            billRateCurrency: [],
            reWeeklyLimit: ['', Validators.compose([Validators.min(0), Validators.max(168)])],
            minimumBillingRate: ['', Validators.min(0)]
        });
    }
    constructor(fb, store, employeeStore, candidateStore) {
        this.fb = fb;
        this.store = store;
        this.employeeStore = employeeStore;
        this.candidateStore = candidateStore;
        this.payPeriods = Object.values(PayPeriodEnum);
        /*
         * Employee Rates Form
         */
        this.form = EmployeeRatesComponent_1.buildForm(this.fb);
    }
    ngOnInit() {
        this.employeeStore.selectedEmployee$
            .pipe(filter((employee) => !!employee), tap((employee) => (this.selectedEmployee = employee)), tap((employee) => this._syncRates(employee)), untilDestroyed(this))
            .subscribe();
        this.candidateStore.selectedCandidate$
            .pipe(filter((candidate) => !!candidate), tap((candidate) => (this.selectedCandidate = candidate)), tap((candidate) => this._syncRates(candidate)), untilDestroyed(this))
            .subscribe();
    }
    async onSubmit() {
        if (this.form.invalid || !this.store.selectedOrganization) {
            return;
        }
        const { id: organizationId } = this.store.selectedOrganization;
        if (this.form.valid && this.isEmployee) {
            this.employeeStore.employeeForm = {
                ...this.form.getRawValue(),
                organizationId
            };
        }
        if (this.form.valid && this.isCandidate) {
            this.candidateStore.candidateForm = {
                ...this.form.getRawValue(),
                organizationId
            };
        }
    }
    async _syncRates(user) {
        this.form.patchValue({
            payPeriod: user.payPeriod,
            billRateValue: user.billRateValue,
            billRateCurrency: user.billRateCurrency,
            reWeeklyLimit: user.reWeeklyLimit,
            minimumBillingRate: user.minimumBillingRate
        });
    }
    /*
     * On Changed Currency Event Emitter
     */
    currencyChanged($event) { }
    get reWeeklyLimit() {
        return this.form.get('reWeeklyLimit');
    }
    get billRateValue() {
        return this.form.get('billRateValue');
    }
    get billRateCurrency() {
        return this.form.get('billRateCurrency');
    }
    get minimumBillingRate() {
        return this.form.get('minimumBillingRate');
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRatesComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.Store }, { token: i2.EmployeeStore }, { token: i2.CandidateStore }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EmployeeRatesComponent, isStandalone: false, selector: "ga-employee-rates", inputs: { isEmployee: "isEmployee", isCandidate: "isCandidate" }, ngImport: i0, template: "<form class=\"rates\" [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n\t<section class=\"rates__panel rates__panel--rate\">\n\t\t<header class=\"rates__legend\">\n\t\t\t@if (isEmployee) {\n\t\t\t\t{{ 'FORM.RATES.DEFAULT_RATE' | translate }}\n\t\t\t}\n\t\t\t@if (isCandidate) {\n\t\t\t\t{{ 'FORM.RATES.EXPECTED_RATE' | translate }}\n\t\t\t}\n\t\t</header>\n\n\t\t<div class=\"rates__fields\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"payPeriodsSelect\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.PAY_PERIOD' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<nb-select\n\t\t\t\t\tid=\"payPeriodsSelect\"\n\t\t\t\t\tformControlName=\"payPeriod\"\n\t\t\t\t\t[placeholder]=\"'FORM.LABELS.PAY_PERIOD' | translate\"\n\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\tfullWidth\n\t\t\t\t>\n\t\t\t\t\t@for (payPeriod of payPeriods; track payPeriod) {\n\t\t\t\t\t\t<nb-option [value]=\"payPeriod\">\n\t\t\t\t\t\t\t{{ payPeriod | replace : '_' : ' ' | titlecase }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t}\n\t\t\t\t</nb-select>\n\t\t\t</div>\n\n\t\t\t<ga-currency formControlName=\"billRateCurrency\" (optionChange)=\"currencyChanged($event)\"></ga-currency>\n\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"label\" for=\"billRateValueInput\">\n\t\t\t\t\t{{ 'FORM.LABELS.BILL_RATE' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"billRateValueInput\"\n\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t[min]=\"minimumBillingRate.value || 0\"\n\t\t\t\t\tstep=\"0.1\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tformControlName=\"billRateValue\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.BILL_RATE' | translate\"\n\t\t\t\t/>\n\t\t\t\t@if (billRateValue.errors?.['min']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t'FORM.RATES.ERRORS.BILL_RATE'\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\t\t: {\n\t\t\t\t\t\t\t\t\t\t\tmin: billRateValue.errors?.['min']?.min,\n\t\t\t\t\t\t\t\t\t\t\tcurrency: billRateCurrency.value\n\t\t\t\t\t\t\t\t\t  }\n\t\t\t\t\t\t}}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"label\" for=\"minimumBillingRateInput\">\n\t\t\t\t\t{{ 'FORM.LABELS.BILL_RATE_MIN' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"minimumBillingRateInput\"\n\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\tstep=\"0.1\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tformControlName=\"minimumBillingRate\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.BILL_RATE_MIN' | translate\"\n\t\t\t\t/>\n\t\t\t\t@if (minimumBillingRate.errors?.['min']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t'FORM.RATES.ERRORS.BILL_RATE_MIN'\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\t\t: {\n\t\t\t\t\t\t\t\t\t\t\tmin: minimumBillingRate.errors?.['min']?.min,\n\t\t\t\t\t\t\t\t\t\t\tcurrency: billRateCurrency.value\n\t\t\t\t\t\t\t\t\t  }\n\t\t\t\t\t\t}}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</div>\n\t</section>\n\n\t<section class=\"rates__panel rates__panel--limits\">\n\t\t<header class=\"rates__legend\">\n\t\t\t{{ 'FORM.RATES.LIMITS' | translate }}\n\t\t</header>\n\n\t\t<div class=\"rates__fields rates__fields--single\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"label\" for=\"reWeeklyLimitInput\">\n\t\t\t\t\t{{ 'FORM.LABELS.RECURRING_WEEKLY_LIMIT' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"reWeeklyLimitInput\"\n\t\t\t\t\tnbInput\n\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t[max]=\"168\"\n\t\t\t\t\tstep=\"0.1\"\n\t\t\t\t\tformControlName=\"reWeeklyLimit\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.RECURRING_WEEKLY_LIMIT' | translate\"\n\t\t\t\t\tautofocus\n\t\t\t\t/>\n\t\t\t\t@if (reWeeklyLimit.errors?.['max']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{ 'FORM.RATES.ERRORS.LIMIT_MAX' | translate : { max: reWeeklyLimit.errors?.['max']?.max } }}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t@if (reWeeklyLimit.errors?.['min']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{ 'FORM.RATES.ERRORS.LIMIT_MIN' | translate : { min: reWeeklyLimit.errors?.['min']?.min } }}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</div>\n\t</section>\n\n\t<footer class=\"rates__actions\">\n\t\t<button [disabled]=\"form.invalid\" type=\"submit\" nbButton status=\"success\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</footer>\n</form>\n", styles: [":host{display:flex;flex-direction:column;min-height:0}.rates{display:grid;grid-template-columns:3fr 2fr;grid-template-rows:minmax(0,1fr) auto;align-items:stretch;gap:1rem;padding:1rem;flex:1 1 auto;min-height:0}.rates__panel{display:flex;flex-direction:column;min-width:0;min-height:0;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.rates__legend{padding:.875rem 1.25rem 0;font-size:.75rem;font-weight:600;line-height:1rem;letter-spacing:.04em;text-transform:uppercase;color:var(--text-hint-color)}.rates__fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 1.25rem;align-content:start;flex:1 1 auto;min-height:0;overflow-y:auto;padding:1.25rem}.rates__fields>.form-group{min-width:0;margin-bottom:1.25rem}.rates__fields--single{grid-template-columns:minmax(0,1fr)}:host ::ng-deep ga-currency{display:block;min-width:0}:host ::ng-deep ga-currency .form-group{display:block;min-width:0;margin-bottom:1.25rem}.caption.status-danger{margin-top:.25rem;font-size:.75rem;line-height:1rem}.rates__actions{grid-column:1/-1;display:flex;justify-content:flex-end;gap:.75rem;padding:.875rem 1.25rem;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.rates__actions button{min-width:7.5rem}@media only screen and (max-width:991px){.rates{grid-template-columns:minmax(0,1fr);grid-template-rows:auto}}@media only screen and (max-width:767px){.rates{padding:.75rem;gap:.75rem}.rates__fields{grid-template-columns:minmax(0,1fr);padding:1rem}.rates__actions{padding:.875rem 1rem}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { kind: "directive", type: i1.MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: ["max"] }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i4.CurrencyComponent, selector: "ga-currency", inputs: ["formControl", "currency", "placeholder", "label"], outputs: ["optionChange"] }, { kind: "pipe", type: i5.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }, { kind: "pipe", type: i7.ReplacePipe, name: "replace" }] }); }
};
EmployeeRatesComponent = EmployeeRatesComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [UntypedFormBuilder,
        Store,
        EmployeeStore,
        CandidateStore])
], EmployeeRatesComponent);
export { EmployeeRatesComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeRatesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-employee-rates', standalone: false, template: "<form class=\"rates\" [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n\t<section class=\"rates__panel rates__panel--rate\">\n\t\t<header class=\"rates__legend\">\n\t\t\t@if (isEmployee) {\n\t\t\t\t{{ 'FORM.RATES.DEFAULT_RATE' | translate }}\n\t\t\t}\n\t\t\t@if (isCandidate) {\n\t\t\t\t{{ 'FORM.RATES.EXPECTED_RATE' | translate }}\n\t\t\t}\n\t\t</header>\n\n\t\t<div class=\"rates__fields\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"payPeriodsSelect\" class=\"label\">\n\t\t\t\t\t{{ 'FORM.LABELS.PAY_PERIOD' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<nb-select\n\t\t\t\t\tid=\"payPeriodsSelect\"\n\t\t\t\t\tformControlName=\"payPeriod\"\n\t\t\t\t\t[placeholder]=\"'FORM.LABELS.PAY_PERIOD' | translate\"\n\t\t\t\t\tclass=\"d-block\"\n\t\t\t\t\tsize=\"medium\"\n\t\t\t\t\tfullWidth\n\t\t\t\t>\n\t\t\t\t\t@for (payPeriod of payPeriods; track payPeriod) {\n\t\t\t\t\t\t<nb-option [value]=\"payPeriod\">\n\t\t\t\t\t\t\t{{ payPeriod | replace : '_' : ' ' | titlecase }}\n\t\t\t\t\t\t</nb-option>\n\t\t\t\t\t}\n\t\t\t\t</nb-select>\n\t\t\t</div>\n\n\t\t\t<ga-currency formControlName=\"billRateCurrency\" (optionChange)=\"currencyChanged($event)\"></ga-currency>\n\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"label\" for=\"billRateValueInput\">\n\t\t\t\t\t{{ 'FORM.LABELS.BILL_RATE' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"billRateValueInput\"\n\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t[min]=\"minimumBillingRate.value || 0\"\n\t\t\t\t\tstep=\"0.1\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tformControlName=\"billRateValue\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.BILL_RATE' | translate\"\n\t\t\t\t/>\n\t\t\t\t@if (billRateValue.errors?.['min']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t'FORM.RATES.ERRORS.BILL_RATE'\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\t\t: {\n\t\t\t\t\t\t\t\t\t\t\tmin: billRateValue.errors?.['min']?.min,\n\t\t\t\t\t\t\t\t\t\t\tcurrency: billRateCurrency.value\n\t\t\t\t\t\t\t\t\t  }\n\t\t\t\t\t\t}}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"label\" for=\"minimumBillingRateInput\">\n\t\t\t\t\t{{ 'FORM.LABELS.BILL_RATE_MIN' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"minimumBillingRateInput\"\n\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\tstep=\"0.1\"\n\t\t\t\t\tnbInput\n\t\t\t\t\tformControlName=\"minimumBillingRate\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.BILL_RATE_MIN' | translate\"\n\t\t\t\t/>\n\t\t\t\t@if (minimumBillingRate.errors?.['min']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t'FORM.RATES.ERRORS.BILL_RATE_MIN'\n\t\t\t\t\t\t\t\t| translate\n\t\t\t\t\t\t\t\t\t: {\n\t\t\t\t\t\t\t\t\t\t\tmin: minimumBillingRate.errors?.['min']?.min,\n\t\t\t\t\t\t\t\t\t\t\tcurrency: billRateCurrency.value\n\t\t\t\t\t\t\t\t\t  }\n\t\t\t\t\t\t}}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</div>\n\t</section>\n\n\t<section class=\"rates__panel rates__panel--limits\">\n\t\t<header class=\"rates__legend\">\n\t\t\t{{ 'FORM.RATES.LIMITS' | translate }}\n\t\t</header>\n\n\t\t<div class=\"rates__fields rates__fields--single\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label class=\"label\" for=\"reWeeklyLimitInput\">\n\t\t\t\t\t{{ 'FORM.LABELS.RECURRING_WEEKLY_LIMIT' | translate }}\n\t\t\t\t</label>\n\t\t\t\t<input\n\t\t\t\t\tfullWidth\n\t\t\t\t\tid=\"reWeeklyLimitInput\"\n\t\t\t\t\tnbInput\n\t\t\t\t\ttype=\"number\"\n\t\t\t\t\t[min]=\"0\"\n\t\t\t\t\t[max]=\"168\"\n\t\t\t\t\tstep=\"0.1\"\n\t\t\t\t\tformControlName=\"reWeeklyLimit\"\n\t\t\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.RECURRING_WEEKLY_LIMIT' | translate\"\n\t\t\t\t\tautofocus\n\t\t\t\t/>\n\t\t\t\t@if (reWeeklyLimit.errors?.['max']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{ 'FORM.RATES.ERRORS.LIMIT_MAX' | translate : { max: reWeeklyLimit.errors?.['max']?.max } }}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t\t@if (reWeeklyLimit.errors?.['min']) {\n\t\t\t\t\t<div class=\"caption status-danger\">\n\t\t\t\t\t\t{{ 'FORM.RATES.ERRORS.LIMIT_MIN' | translate : { min: reWeeklyLimit.errors?.['min']?.min } }}\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</div>\n\t</section>\n\n\t<footer class=\"rates__actions\">\n\t\t<button [disabled]=\"form.invalid\" type=\"submit\" nbButton status=\"success\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</footer>\n</form>\n", styles: [":host{display:flex;flex-direction:column;min-height:0}.rates{display:grid;grid-template-columns:3fr 2fr;grid-template-rows:minmax(0,1fr) auto;align-items:stretch;gap:1rem;padding:1rem;flex:1 1 auto;min-height:0}.rates__panel{display:flex;flex-direction:column;min-width:0;min-height:0;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.rates__legend{padding:.875rem 1.25rem 0;font-size:.75rem;font-weight:600;line-height:1rem;letter-spacing:.04em;text-transform:uppercase;color:var(--text-hint-color)}.rates__fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 1.25rem;align-content:start;flex:1 1 auto;min-height:0;overflow-y:auto;padding:1.25rem}.rates__fields>.form-group{min-width:0;margin-bottom:1.25rem}.rates__fields--single{grid-template-columns:minmax(0,1fr)}:host ::ng-deep ga-currency{display:block;min-width:0}:host ::ng-deep ga-currency .form-group{display:block;min-width:0;margin-bottom:1.25rem}.caption.status-danger{margin-top:.25rem;font-size:.75rem;line-height:1rem}.rates__actions{grid-column:1/-1;display:flex;justify-content:flex-end;gap:.75rem;padding:.875rem 1.25rem;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.rates__actions button{min-width:7.5rem}@media only screen and (max-width:991px){.rates{grid-template-columns:minmax(0,1fr);grid-template-rows:auto}}@media only screen and (max-width:767px){.rates{padding:.75rem;gap:.75rem}.rates__fields{grid-template-columns:minmax(0,1fr);padding:1rem}.rates__actions{padding:.875rem 1rem}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.Store }, { type: i2.EmployeeStore }, { type: i2.CandidateStore }], propDecorators: { isEmployee: [{
                type: Input
            }], isCandidate: [{
                type: Input
            }] } });
//# sourceMappingURL=employee-rates.component.js.map