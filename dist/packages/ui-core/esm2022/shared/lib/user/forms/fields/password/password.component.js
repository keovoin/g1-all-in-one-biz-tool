import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChange, isEmpty } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
let PasswordFormFieldComponent = class PasswordFormFieldComponent extends TranslationBaseComponent {
    /**
     * Getter & Setter accessor including call the onchange callback
     */
    get value() {
        return this.innerValue;
    }
    set value(v) {
        if (v !== this.innerValue) {
            this.innerValue = v;
        }
    }
    get ctrl() {
        return this._ctrl;
    }
    set ctrl(value) {
        this._ctrl = value;
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get icon() {
        return this._icon;
    }
    set icon(value) {
        this._icon = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get fieldSize() {
        return this._fieldSize;
    }
    set fieldSize(value) {
        this._fieldSize = value;
    }
    get ngClass() {
        return this._ngClass;
    }
    set ngClass(value) {
        this._ngClass = value;
    }
    constructor(translateService) {
        super(translateService);
        this.translateService = translateService;
        this.showPassword = false;
        //The internal data model for form control value access
        this.innerValue = '';
        this.onChange = (_) => { };
        this.onTouched = (_) => { };
        /*
         * Getter & Setter accessor for dynamic form control
         */
        this._ctrl = new FormControl();
        /*
         * Getter & Setter accessor for dynamic placeholder
         */
        this._icon = true;
        /*
         * Getter & Setter for dynamic field size
         */
        this._fieldSize = 'medium';
        this.onInputChanged = new EventEmitter();
    }
    ngOnChanges() { }
    ngAfterViewInit() {
        this.ctrl.valueChanges.pipe(debounceTime(100), distinctUntilChange(), untilDestroyed(this)).subscribe(() => {
            // check condition if the form control is RESET
            if (isEmpty(this.ctrl.value)) {
                this.innerValue = '';
                this.inputRef.nativeElement.value = '';
            }
            this.onInputChanged.emit(this.ctrl.value);
        });
    }
    // event fired when input value is changed. later propagated up to the form control using the custom value accessor interface
    onInputChange(e, value) {
        //set changed value
        this.innerValue = value;
        // propagate value into form control using control value accessor interface
        this.onChange(this.innerValue);
    }
    //from control value accessor interface
    writeValue(value) {
        this.innerValue = value;
    }
    //from control value accessor interface
    registerOnChange(fn) {
        this.onChange = fn;
    }
    //from control value accessor interface
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PasswordFormFieldComponent, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PasswordFormFieldComponent, isStandalone: false, selector: "ngx-password-form-field", inputs: { ctrl: "ctrl", label: "label", placeholder: "placeholder", icon: "icon", id: "id", fieldSize: "fieldSize", ngClass: "ngClass", autocomplete: "autocomplete" }, outputs: { onInputChanged: "onInputChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PasswordFormFieldComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "inputRef", first: true, predicate: ["input"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"form-group\">\n\t<label class=\"label\" [attr.for]=\"id\" [innerText]=\"label\"></label>\n\t<nb-form-field>\n\t\t<input\n\t\t\t#input\n\t\t\tfullWidth\n\t\t\tnbInput\n\t\t\t[fieldSize]=\"fieldSize\"\n\t\t\t[formControl]=\"ctrl\"\n\t\t\t(blur)=\"onInputChange($event, input.value)\"\n\t\t\t[status]=\"ctrl.invalid && (ctrl.touched || ctrl.dirty) ? 'danger' : 'basic'\"\n\t\t\t[attr.type]=\"showPassword ? 'text' : 'password'\"\n\t\t\t[attr.placeholder]=\"placeholder\"\n\t\t\t[attr.id]=\"id\"\n\t\t\t[class]=\"ngClass\"\n\t\t\t[autocomplete]=\"autocomplete\"\n\t\t/>\n\t\t@if (icon) {\n\t\t<button nbSuffix nbButton ghost type=\"button\" (click)=\"showPassword = !showPassword\">\n\t\t\t<nb-icon\n\t\t\t\t[icon]=\"showPassword ? 'eye-outline' : 'eye-off-outline'\"\n\t\t\t\tpack=\"eva\"\n\t\t\t\t[attr.aria-label]=\"showPassword ? 'hide password' : 'show password'\"\n\t\t\t>\n\t\t\t</nb-icon>\n\t\t</button>\n\t\t}\n\t</nb-form-field>\n\t<ng-content select=\".invalid-feedback\"></ng-content>\n</div>\n", dependencies: [{ kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "directive", type: i3.NbSuffixDirective, selector: "[nbSuffix]" }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }] }); }
};
PasswordFormFieldComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService])
], PasswordFormFieldComponent);
export { PasswordFormFieldComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PasswordFormFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-password-form-field', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PasswordFormFieldComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div class=\"form-group\">\n\t<label class=\"label\" [attr.for]=\"id\" [innerText]=\"label\"></label>\n\t<nb-form-field>\n\t\t<input\n\t\t\t#input\n\t\t\tfullWidth\n\t\t\tnbInput\n\t\t\t[fieldSize]=\"fieldSize\"\n\t\t\t[formControl]=\"ctrl\"\n\t\t\t(blur)=\"onInputChange($event, input.value)\"\n\t\t\t[status]=\"ctrl.invalid && (ctrl.touched || ctrl.dirty) ? 'danger' : 'basic'\"\n\t\t\t[attr.type]=\"showPassword ? 'text' : 'password'\"\n\t\t\t[attr.placeholder]=\"placeholder\"\n\t\t\t[attr.id]=\"id\"\n\t\t\t[class]=\"ngClass\"\n\t\t\t[autocomplete]=\"autocomplete\"\n\t\t/>\n\t\t@if (icon) {\n\t\t<button nbSuffix nbButton ghost type=\"button\" (click)=\"showPassword = !showPassword\">\n\t\t\t<nb-icon\n\t\t\t\t[icon]=\"showPassword ? 'eye-outline' : 'eye-off-outline'\"\n\t\t\t\tpack=\"eva\"\n\t\t\t\t[attr.aria-label]=\"showPassword ? 'hide password' : 'show password'\"\n\t\t\t>\n\t\t\t</nb-icon>\n\t\t</button>\n\t\t}\n\t</nb-form-field>\n\t<ng-content select=\".invalid-feedback\"></ng-content>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }], propDecorators: { ctrl: [{
                type: Input
            }], label: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], icon: [{
                type: Input
            }], id: [{
                type: Input
            }], fieldSize: [{
                type: Input
            }], ngClass: [{
                type: Input
            }], autocomplete: [{
                type: Input
            }], onInputChanged: [{
                type: Output
            }], inputRef: [{
                type: ViewChild,
                args: ['input']
            }] } });
//# sourceMappingURL=password.component.js.map