import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@ng-select/ng-select";
import * as i3 from "../../pipes/time-format.pipe";
export class TimerPickerComponent {
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = value;
        this.updateSlots();
    }
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = value;
        this.updateSlots();
    }
    constructor() {
        this._max = '23:00';
        this._min = '00:00';
        this.timeSlots = [];
        this.onChange = () => { };
        this.onTouched = () => { };
        this.disabled = false;
        this.change = new EventEmitter();
    }
    set selectedTime(val) {
        this.val = val;
        this.onChange(val);
        this.onTouched(val);
        this.change.emit(val);
    }
    get selectedTime() {
        return this.val;
    }
    ngOnInit() {
        this.updateSlots();
    }
    updateSlots() {
        const interval = 5;
        let slotTime = moment(this.min, 'HH:mm');
        const endTime = moment(this.max, 'HH:mm');
        const times = [];
        while (slotTime <= endTime) {
            times.push({
                value: slotTime.format('HH:mm'),
                label: slotTime.format('hh:mm A')
            });
            slotTime = slotTime.add(interval, 'minutes');
        }
        this.timeSlots = times;
    }
    writeValue(value) {
        this.val = value;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerPickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TimerPickerComponent, isStandalone: false, selector: "ga-timer-picker", inputs: { disabled: "disabled", min: "min", max: "max" }, outputs: { change: "change" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TimerPickerComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div (click)=\"$event.stopPropagation()\">\n\t<ng-select\n\t\t[disabled]=\"disabled\"\n\t\t[clearable]=\"true\"\n\t\t[items]=\"timeSlots\"\n\t\t[(ngModel)]=\"selectedTime\"\n\t\tbindValue=\"value\"\n\t\tappendTo=\"body\"\n\t\tbindLabel=\"label\"\n\t\t[placeholder]=\"'00:00' | timeFormat\"\n\t>\n\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t{{ item.value | timeFormat }}\n\t\t</ng-template>\n\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t<span>{{ item.value | timeFormat }}</span>\n\t\t</ng-template>\n\t</ng-select>\n</div>\n", dependencies: [{ kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i2.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i2.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i3.TimeFormatPipe, name: "timeFormat" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-timer-picker', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TimerPickerComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div (click)=\"$event.stopPropagation()\">\n\t<ng-select\n\t\t[disabled]=\"disabled\"\n\t\t[clearable]=\"true\"\n\t\t[items]=\"timeSlots\"\n\t\t[(ngModel)]=\"selectedTime\"\n\t\tbindValue=\"value\"\n\t\tappendTo=\"body\"\n\t\tbindLabel=\"label\"\n\t\t[placeholder]=\"'00:00' | timeFormat\"\n\t>\n\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t{{ item.value | timeFormat }}\n\t\t</ng-template>\n\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t<span>{{ item.value | timeFormat }}</span>\n\t\t</ng-template>\n\t</ng-select>\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { disabled: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], change: [{
                type: Output
            }] } });
//# sourceMappingURL=timer-picker.component.js.map