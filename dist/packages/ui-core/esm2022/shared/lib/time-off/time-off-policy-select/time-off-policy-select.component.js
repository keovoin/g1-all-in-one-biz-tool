import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, first, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { TimeOffService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
let TimeOffPolicySelectComponent = class TimeOffPolicySelectComponent {
    set policyId(value) {
        if (value) {
            this._policyId = value;
            this.onChange(value);
            this.onTouched();
        }
    }
    get policyId() {
        return this._policyId;
    }
    set policy(value) {
        if (value) {
            this._policy = value;
        }
    }
    get policy() {
        return this._policy;
    }
    get ctrl() {
        return this._ctrl;
    }
    set ctrl(value) {
        this._ctrl = value;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    constructor(_store, timeOffService) {
        this._store = _store;
        this.timeOffService = timeOffService;
        this.policies = [];
        this.policies$ = new Subject();
        this.onChange = () => { };
        this.onTouched = () => { };
        this.selectedChange = new EventEmitter();
        /*
         * Getter & Setter accessor for dynamic form control
         */
        this._ctrl = new FormControl();
    }
    ngOnInit() {
        this.policies$
            .pipe(tap(() => this.getTimeOffPolicies()), untilDestroyed(this))
            .subscribe();
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.policies$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    writeValue(policyId) {
        if (policyId) {
            this.policyId = policyId;
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * On policy select
     *
     * @param selectedItem
     */
    onSelectedChange(policyId) {
        this.policy = this.getPolicyById(policyId);
        this.selectedChange.emit(this.policy || null);
    }
    /**
     * GET time off policies
     *
     * @returns
     */
    getTimeOffPolicies() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this._store.user;
        const { id: organizationId } = this.organization;
        this.timeOffService
            .getAllPolicies(['employees'], {
            organizationId,
            tenantId
        })
            .pipe(first(), tap(({ items }) => (this.policies = items)))
            .subscribe();
    }
    getPolicyById(policyId) {
        return this.policies.find((policy) => policyId === policy.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffPolicySelectComponent, deps: [{ token: i1.Store }, { token: i1.TimeOffService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TimeOffPolicySelectComponent, isStandalone: false, selector: "ga-time-off-policy-select", inputs: { policyId: "policyId", policy: "policy", ctrl: "ctrl", placeholder: "placeholder", id: "id" }, outputs: { selectedChange: "selectedChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TimeOffPolicySelectComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"form-group\">\n  <label class=\"label\" [attr.for]=\"id\">\n    {{ 'TIME_OFF_PAGE.POLICY.POLICY' | translate }}\n  </label>\n  <nb-select\n    [formControl]=\"ctrl\"\n    fullWidth\n    [placeholder]=\"placeholder || 'TIME_OFF_PAGE.SELECT_TIME_OFF_POLICY' | translate\"\n    [attr.id]=\"id\"\n    (selectedChange)=\"onSelectedChange($event)\"\n    [(ngModel)]=\"policyId\"\n\t\t[status]=\"\n\t\t\tctrl.invalid && (ctrl.touched || ctrl.dirty)\n\t\t\t\t? 'danger' \n\t\t\t\t: 'basic'\"\n    >\n    @for (policy of policies; track policy) {\n      <nb-option\n        [value]=\"policy.id\"\n        >\n        {{ policy?.name }}\n      </nb-option>\n    }\n  </nb-select>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
TimeOffPolicySelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store, TimeOffService])
], TimeOffPolicySelectComponent);
export { TimeOffPolicySelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffPolicySelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-time-off-policy-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TimeOffPolicySelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div class=\"form-group\">\n  <label class=\"label\" [attr.for]=\"id\">\n    {{ 'TIME_OFF_PAGE.POLICY.POLICY' | translate }}\n  </label>\n  <nb-select\n    [formControl]=\"ctrl\"\n    fullWidth\n    [placeholder]=\"placeholder || 'TIME_OFF_PAGE.SELECT_TIME_OFF_POLICY' | translate\"\n    [attr.id]=\"id\"\n    (selectedChange)=\"onSelectedChange($event)\"\n    [(ngModel)]=\"policyId\"\n\t\t[status]=\"\n\t\t\tctrl.invalid && (ctrl.touched || ctrl.dirty)\n\t\t\t\t? 'danger' \n\t\t\t\t: 'basic'\"\n    >\n    @for (policy of policies; track policy) {\n      <nb-option\n        [value]=\"policy.id\"\n        >\n        {{ policy?.name }}\n      </nb-option>\n    }\n  </nb-select>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.TimeOffService }], propDecorators: { selectedChange: [{
                type: Output
            }], policyId: [{
                type: Input
            }], policy: [{
                type: Input
            }], ctrl: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], id: [{
                type: Input
            }] } });
//# sourceMappingURL=time-off-policy-select.component.js.map