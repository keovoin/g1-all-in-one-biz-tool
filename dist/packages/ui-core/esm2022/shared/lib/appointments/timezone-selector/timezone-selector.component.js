import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import timezone from 'moment-timezone';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
export class TimezoneSelectorComponent extends TranslationBaseComponent {
    constructor(dialogRef, translateService) {
        super(translateService);
        this.dialogRef = dialogRef;
        this.translateService = translateService;
        this.listOfZones = timezone.tz.names().filter((zone) => zone.includes('/'));
    }
    ngOnInit() { }
    close() {
        this.dialogRef.close();
    }
    getTimeWithOffset(zone) {
        let cutZone = zone;
        if (zone.includes('/')) {
            cutZone = zone.split('/')[1];
        }
        const offset = timezone.tz(zone).format('zZ');
        return '(' + offset + ') ' + cutZone;
    }
    select() {
        this.dialogRef.close(this.selectedTimezone);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneSelectorComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TimezoneSelectorComponent, isStandalone: false, selector: "ng-component", inputs: { selectedTimezone: "selectedTimezone" }, usesInheritance: true, ngImport: i0, template: "<nb-card style=\"height: 450px\" class=\"main\">\n\t<nb-card-header class=\"d-flex\">\n\t\t<h4 style=\"width: 400px\">\n\t\t\t{{ 'POP_UPS.SELECT_TIMEZONE' | translate }}\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<ng-select\n\t\t\t[(items)]=\"listOfZones\"\n\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TIME_ZONE' | translate\"\n\t\t\t[(ngModel)]=\"selectedTimezone\"\n\t\t\t[searchable]=\"true\"\n\t\t\tappendTo=\"body\"\n\t\t>\n\t\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t\t{{ getTimeWithOffset(item) }}\n\t\t\t</ng-template>\n\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t{{ getTimeWithOffset(item) }}\n\t\t\t</ng-template>\n\t\t</ng-select>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-right\">\n\t\t<button (click)=\"close()\" status=\"danger\" class=\"mr-3\" nbButton type=\"button\">\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button (click)=\"select()\" status=\"success\" nbButton type=\"button\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", dependencies: [{ kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimezoneSelectorComponent, decorators: [{
            type: Component,
            args: [{ standalone: false, template: "<nb-card style=\"height: 450px\" class=\"main\">\n\t<nb-card-header class=\"d-flex\">\n\t\t<h4 style=\"width: 400px\">\n\t\t\t{{ 'POP_UPS.SELECT_TIMEZONE' | translate }}\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<ng-select\n\t\t\t[(items)]=\"listOfZones\"\n\t\t\t[placeholder]=\"'FORM.PLACEHOLDERS.CHOOSE_TIME_ZONE' | translate\"\n\t\t\t[(ngModel)]=\"selectedTimezone\"\n\t\t\t[searchable]=\"true\"\n\t\t\tappendTo=\"body\"\n\t\t>\n\t\t\t<ng-template ng-option-tmp let-item=\"item\" let-index=\"index\">\n\t\t\t\t{{ getTimeWithOffset(item) }}\n\t\t\t</ng-template>\n\t\t\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t\t\t{{ getTimeWithOffset(item) }}\n\t\t\t</ng-template>\n\t\t</ng-select>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-right\">\n\t\t<button (click)=\"close()\" status=\"danger\" class=\"mr-3\" nbButton type=\"button\">\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button (click)=\"select()\" status=\"success\" nbButton type=\"button\">\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n" }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.TranslateService }], propDecorators: { selectedTimezone: [{
                type: Input
            }] } });
//# sourceMappingURL=timezone-selector.component.js.map