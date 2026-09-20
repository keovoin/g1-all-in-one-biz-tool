import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, map, of as observableOf } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@gauzy/ui-core/core';
import { RoleService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
let RoleFormFieldComponent = class RoleFormFieldComponent {
    get excludes() {
        return this._excludes;
    }
    set excludes(value) {
        this._excludes = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    get ctrl() {
        return this._ctrl;
    }
    set ctrl(value) {
        this._ctrl = value;
    }
    set role(value) {
        this._role = value;
        this.onChange(value);
        this.onTouched(value);
    }
    get role() {
        return this._role;
    }
    get roleId() {
        return this._roleId;
    }
    set roleId(value) {
        this._roleId = value;
    }
    constructor(store, rolesService) {
        this.store = store;
        this.rolesService = rolesService;
        this.roles = [];
        this.roles$ = observableOf([]);
        this.onChange = () => { };
        this.onTouched = () => { };
        /**
         * Getter & Setter for dynamic remove role from options
         */
        this._excludes = [];
        /*
         * Getter & Setter for dynamic field size
         */
        this._size = 'medium';
        /*
         * Getter & Setter accessor for form control
         */
        this._ctrl = new FormControl();
        this.selectedChange = new EventEmitter();
    }
    ngOnInit() {
        this.store.user$
            .pipe(filter((user) => !!user), tap(() => this.renderRoles()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * GET all tenant roles
     * Excludes role if needed
     */
    async renderRoles() {
        this.roles$ = observableOf((await this.rolesService.getAll()).items).pipe(map((roles) => roles.filter((role) => !this.excludes.includes(role.name))), tap((roles) => (this.roles = roles)));
    }
    /**
     * Write Value
     * @param value
     */
    writeValue(value) {
        if (value) {
            this.roleId = value.id;
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * On Selection Change
     * @param role
     */
    onSelectionChange(roleId) {
        if (roleId) {
            this.role = this.getRoleById(roleId);
            if (this.role) {
                this.selectedChange.emit(this.role);
            }
        }
    }
    /**
     * GET role by ID
     *
     * @param value
     * @returns
     */
    getRoleById(value) {
        return this.roles.find((role) => value === role.id);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleFormFieldComponent, deps: [{ token: i1.Store }, { token: i1.RoleService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RoleFormFieldComponent, isStandalone: false, selector: "ngx-role-form-field", inputs: { excludes: "excludes", id: "id", size: "size", placeholder: "placeholder", label: "label", ctrl: "ctrl" }, outputs: { selectedChange: "selectedChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => RoleFormFieldComponent),
                multi: true
            }
        ], ngImport: i0, template: "\n<div class=\"form-group\">\n  <label class=\"label\" [attr.for]=\"id\">\n    {{ (label || 'FORM.LABELS.ROLE') | translate }}\n  </label>\n  <nb-select\n    fullWidth\n    [placeholder]=\"(placeholder || 'FORM.PLACEHOLDERS.ROLE') | translate\"\n    [size]=\"size\"\n    [attr.id]=\"id\"\n    (selectedChange)=\"onSelectionChange($event)\"\n    [formControl]=\"ctrl\"\n    [(ngModel)]=\"roleId\"\n\t\t[status]=\"\n\t\t\t\tctrl.invalid && (ctrl.touched || ctrl.dirty)\n\t\t\t\t\t? 'danger' \n\t\t\t\t\t: 'basic'\"\n    >\n    @for (role of roles$ | async; track role) {\n      <nb-option [value]=\"role.id\">\n        {{ role.name }}\n      </nb-option>\n    }\n  </nb-select>\n</div>", dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
RoleFormFieldComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store, RoleService])
], RoleFormFieldComponent);
export { RoleFormFieldComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleFormFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-role-form-field', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => RoleFormFieldComponent),
                            multi: true
                        }
                    ], standalone: false, template: "\n<div class=\"form-group\">\n  <label class=\"label\" [attr.for]=\"id\">\n    {{ (label || 'FORM.LABELS.ROLE') | translate }}\n  </label>\n  <nb-select\n    fullWidth\n    [placeholder]=\"(placeholder || 'FORM.PLACEHOLDERS.ROLE') | translate\"\n    [size]=\"size\"\n    [attr.id]=\"id\"\n    (selectedChange)=\"onSelectionChange($event)\"\n    [formControl]=\"ctrl\"\n    [(ngModel)]=\"roleId\"\n\t\t[status]=\"\n\t\t\t\tctrl.invalid && (ctrl.touched || ctrl.dirty)\n\t\t\t\t\t? 'danger' \n\t\t\t\t\t: 'basic'\"\n    >\n    @for (role of roles$ | async; track role) {\n      <nb-option [value]=\"role.id\">\n        {{ role.name }}\n      </nb-option>\n    }\n  </nb-select>\n</div>" }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.RoleService }], propDecorators: { excludes: [{
                type: Input
            }], id: [{
                type: Input
            }], size: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], label: [{
                type: Input
            }], ctrl: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }] } });
//# sourceMappingURL=role.component.js.map