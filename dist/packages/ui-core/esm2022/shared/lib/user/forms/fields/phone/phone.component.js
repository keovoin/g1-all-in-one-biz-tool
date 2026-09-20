import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
let PhoneFormInputComponent = class PhoneFormInputComponent {
    set phoneNumber(val) {
        this._phoneNumber = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get phoneNumber() {
        return this._phoneNumber;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    constructor() {
        this.onChange = () => { };
        this.onTouched = () => { };
        this.onChanged = new EventEmitter();
    }
    /**
     *
     */
    ngOnInit() { }
    /**
     *
     * @param value
     */
    writeValue(value) {
        if (value) {
            this._phoneNumber = value;
        }
    }
    /**
     *
     * @param fn
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     *
     * @param fn
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     *
     */
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PhoneFormInputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PhoneFormInputComponent, isStandalone: false, selector: "ngx-phone-form-input", inputs: { phoneNumber: "phoneNumber", placeholder: "placeholder" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PhoneFormInputComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"form-group\">\n    <label class=\"label\" for=\"phoneNumber\">\n        {{ 'FORM.LABELS.PHONE_NUMBER' | translate }}\n    </label>\n    <input\n        [placeholder]=\"(placeholder || 'FORM.PLACEHOLDERS.PHONE_NUMBER') | translate\"\n        fullWidth\n        id=\"phoneNumber\"\n        type=\"phoneNumber\"\n        nbInput\n        [(ngModel)]=\"phoneNumber\"\n    />\n</div>\n", dependencies: [{ kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
PhoneFormInputComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], PhoneFormInputComponent);
export { PhoneFormInputComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PhoneFormInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-phone-form-input', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PhoneFormInputComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div class=\"form-group\">\n    <label class=\"label\" for=\"phoneNumber\">\n        {{ 'FORM.LABELS.PHONE_NUMBER' | translate }}\n    </label>\n    <input\n        [placeholder]=\"(placeholder || 'FORM.PLACEHOLDERS.PHONE_NUMBER') | translate\"\n        fullWidth\n        id=\"phoneNumber\"\n        type=\"phoneNumber\"\n        nbInput\n        [(ngModel)]=\"phoneNumber\"\n    />\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { phoneNumber: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=phone.component.js.map