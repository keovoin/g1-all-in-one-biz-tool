import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import timezone from 'moment-timezone';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@ng-select/ng-select";
import * as i3 from "@ngx-translate/core";
let TimeZoneSelectorComponent = class TimeZoneSelectorComponent {
    set timeZone(val) {
        this._timeZone = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get timeZone() {
        return this._timeZone;
    }
    constructor() {
        this.listOfZones = timezone.tz.names().filter((zone) => zone.includes('/'));
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
     * @param zone
     * @returns
     */
    getTimeZoneWithOffset(zone) {
        let cutZone = zone;
        if (zone.includes('/')) {
            cutZone = zone.split('/')[1];
        }
        const offset = timezone.tz(zone).format('zZ');
        return '(' + offset + ') ' + cutZone;
    }
    /**
     *
     * @param value
     */
    writeValue(value) {
        if (value) {
            this._timeZone = value;
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
     * @param timeZone
     */
    selectTimeZone(timeZone) {
        this.timeZone = timeZone;
        this.onChanged.emit(timeZone);
    }
    /**
     *
     */
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeZoneSelectorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TimeZoneSelectorComponent, isStandalone: false, selector: "ga-timezone-selector", inputs: { timeZone: "timeZone" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TimeZoneSelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"form-group\">\n\t<label class=\"label\" for=\"timeZone\">\n\t\t{{ 'FORM.LABELS.CHOOSE_TIME_ZONE' | translate }}\n\t</label>\n\t<ng-select\n\t\t[(items)]=\"listOfZones\"\n\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TIME_ZONE' | translate\"\n\t\t[searchable]=\"true\"\n\t\t[clearable]=\"true\"\n\t\t[(ngModel)]=\"timeZone\"\n\t\t(change)=\"selectTimeZone($event)\"\n\t\tid=\"timeZone\"\n\t\tappendTo=\"body\"\n\t>\n\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t{{ getTimeZoneWithOffset(item) }}\n\t\t</ng-template>\n\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t{{ getTimeZoneWithOffset(item) }}\n\t\t</ng-template>\n\t</ng-select>\n</div>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i2.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i2.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
TimeZoneSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], TimeZoneSelectorComponent);
export { TimeZoneSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeZoneSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-timezone-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TimeZoneSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div class=\"form-group\">\n\t<label class=\"label\" for=\"timeZone\">\n\t\t{{ 'FORM.LABELS.CHOOSE_TIME_ZONE' | translate }}\n\t</label>\n\t<ng-select\n\t\t[(items)]=\"listOfZones\"\n\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TIME_ZONE' | translate\"\n\t\t[searchable]=\"true\"\n\t\t[clearable]=\"true\"\n\t\t[(ngModel)]=\"timeZone\"\n\t\t(change)=\"selectTimeZone($event)\"\n\t\tid=\"timeZone\"\n\t\tappendTo=\"body\"\n\t>\n\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t{{ getTimeZoneWithOffset(item) }}\n\t\t</ng-template>\n\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t{{ getTimeZoneWithOffset(item) }}\n\t\t</ng-template>\n\t</ng-select>\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { timeZone: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=timezone-selector.component.js.map