import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "@ngx-translate/core";
export class EditEmployeeMembershipFormComponent {
    static buildForm(fb) {
        return fb.group({
            departments: ['', Validators.required]
        });
    }
    constructor(fb, store) {
        this.fb = fb;
        this.store = store;
        this.organizationEntities = [];
        this.employeeEntities = [];
        this.entitiesAdded = new EventEmitter();
        this.entitiesRemoved = new EventEmitter();
        this.organization = this.store.selectedOrganization;
        this.form = EditEmployeeMembershipFormComponent.buildForm(this.fb);
    }
    ngOnInit() { }
    async removeDepartment(id) {
        if (!this.organization) {
            return;
        }
        const { id: organizationId } = this.organization;
        this.entitiesRemoved.emit({
            member: this.selectedEmployee,
            removedEntityIds: [id],
            organizationId: organizationId
        });
    }
    async submitForm() {
        if (!this.organization) {
            return;
        }
        if (this.form.valid) {
            const { id: organizationId } = this.organization;
            this.entitiesAdded.emit({
                member: this.selectedEmployee,
                addedEntityIds: this.form.value.departments,
                organizationId: organizationId
            });
            this.showAddCard = !this.showAddCard;
            this.form.reset();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditEmployeeMembershipFormComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: EditEmployeeMembershipFormComponent, isStandalone: false, selector: "ga-edit-employee-membership", inputs: { organizationEntities: "organizationEntities", employeeEntities: "employeeEntities", selectedEmployee: "selectedEmployee", placeholder: "placeholder", title: "title" }, outputs: { entitiesAdded: "entitiesAdded", entitiesRemoved: "entitiesRemoved" }, ngImport: i0, template: "<section class=\"membership\">\n\t<header class=\"membership__header\">\n\t\t<h6 class=\"membership__title\">{{ title }}</h6>\n\n\t\t@if (!showAddCard) {\n\t\t\t<button type=\"button\" (click)=\"showAddCard = !showAddCard\" nbButton status=\"success\" size=\"small\">\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"plus-outline\"></nb-icon>{{ 'BUTTONS.ADD' | translate }}\n\t\t\t</button>\n\t\t}\n\t</header>\n\n\t@if (showAddCard) {\n\t\t<form class=\"membership__add\" [formGroup]=\"form\">\n\t\t\t<ng-select\n\t\t\t\tclass=\"membership__select\"\n\t\t\t\tid=\"departmentsSelect\"\n\t\t\t\t[hideSelected]=\"true\"\n\t\t\t\tmultiple=\"true\"\n\t\t\t\tbindLabel=\"name\"\n\t\t\t\tappendTo=\"body\"\n\t\t\t\tformControlName=\"departments\"\n\t\t\t\t[placeholder]=\"placeholder\"\n\t\t\t>\n\t\t\t\t@for (entity of organizationEntities; track entity) {\n\t\t\t\t\t<ng-option [value]=\"entity.id\">\n\t\t\t\t\t\t{{ entity.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t}\n\t\t\t</ng-select>\n\n\t\t\t<div class=\"membership__add-actions\">\n\t\t\t\t<button type=\"button\" (click)=\"showAddCard = !showAddCard\" nbButton status=\"basic\" outline>\n\t\t\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button type=\"button\" (click)=\"submitForm()\" nbButton status=\"success\" [disabled]=\"form.invalid\">\n\t\t\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</form>\n\t}\n\n\t@if (employeeEntities?.length) {\n\t\t<ul class=\"membership__list\">\n\t\t\t@for (entity of employeeEntities; track entity) {\n\t\t\t\t<li class=\"membership__row\">\n\t\t\t\t\t<span class=\"membership__name\">{{ entity.name }}</span>\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"membership__remove\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t[attr.aria-label]=\"'BUTTONS.REMOVE' | translate\"\n\t\t\t\t\t\t[nbTooltip]=\"'BUTTONS.REMOVE' | translate\"\n\t\t\t\t\t\t(click)=\"removeDepartment(entity.id)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</li>\n\t\t\t}\n\t\t</ul>\n\t}\n</section>\n", styles: [":host{display:flex;flex-direction:column;min-height:0}.membership{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.membership__header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.875rem 1.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}.membership__title{margin:0;font-size:var(--text-subtitle-2-font-size);font-weight:500;line-height:1.125rem;color:var(--gauzy-text-color-1)}.membership__add{display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}.membership__select{flex:1 1 auto;min-width:0}.membership__add-actions{display:flex;flex:0 0 auto;gap:.5rem}.membership__list{list-style:none;margin:0;padding:.5rem 0;flex:1 1 auto;min-height:0;overflow-y:auto}.membership__row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem 1.25rem;min-height:2.5rem;transition:background-color .15s ease-in-out}.membership__row:hover{background-color:var(--gauzy-sidebar-background-4)}.membership__name{min-width:0;font-size:var(--text-subtitle-2-font-size);font-weight:var(--text-paragraph-font-weight);line-height:1.125rem;color:var(--gauzy-text-color-1);overflow-wrap:anywhere}.membership__remove{flex:0 0 auto;opacity:.55;transition:opacity .15s ease-in-out}.membership__remove nb-icon{font-size:1rem;width:1rem;height:1rem}.membership__row:hover .membership__remove,.membership__remove:hover,.membership__remove:focus-visible{opacity:1}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i4.NgOptionComponent, selector: "ng-option", inputs: ["value", "disabled"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditEmployeeMembershipFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-edit-employee-membership', standalone: false, template: "<section class=\"membership\">\n\t<header class=\"membership__header\">\n\t\t<h6 class=\"membership__title\">{{ title }}</h6>\n\n\t\t@if (!showAddCard) {\n\t\t\t<button type=\"button\" (click)=\"showAddCard = !showAddCard\" nbButton status=\"success\" size=\"small\">\n\t\t\t\t<nb-icon class=\"mr-1\" icon=\"plus-outline\"></nb-icon>{{ 'BUTTONS.ADD' | translate }}\n\t\t\t</button>\n\t\t}\n\t</header>\n\n\t@if (showAddCard) {\n\t\t<form class=\"membership__add\" [formGroup]=\"form\">\n\t\t\t<ng-select\n\t\t\t\tclass=\"membership__select\"\n\t\t\t\tid=\"departmentsSelect\"\n\t\t\t\t[hideSelected]=\"true\"\n\t\t\t\tmultiple=\"true\"\n\t\t\t\tbindLabel=\"name\"\n\t\t\t\tappendTo=\"body\"\n\t\t\t\tformControlName=\"departments\"\n\t\t\t\t[placeholder]=\"placeholder\"\n\t\t\t>\n\t\t\t\t@for (entity of organizationEntities; track entity) {\n\t\t\t\t\t<ng-option [value]=\"entity.id\">\n\t\t\t\t\t\t{{ entity.name }}\n\t\t\t\t\t</ng-option>\n\t\t\t\t}\n\t\t\t</ng-select>\n\n\t\t\t<div class=\"membership__add-actions\">\n\t\t\t\t<button type=\"button\" (click)=\"showAddCard = !showAddCard\" nbButton status=\"basic\" outline>\n\t\t\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button type=\"button\" (click)=\"submitForm()\" nbButton status=\"success\" [disabled]=\"form.invalid\">\n\t\t\t\t\t{{ 'BUTTONS.ADD' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</form>\n\t}\n\n\t@if (employeeEntities?.length) {\n\t\t<ul class=\"membership__list\">\n\t\t\t@for (entity of employeeEntities; track entity) {\n\t\t\t\t<li class=\"membership__row\">\n\t\t\t\t\t<span class=\"membership__name\">{{ entity.name }}</span>\n\t\t\t\t\t<button\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"membership__remove\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tstatus=\"basic\"\n\t\t\t\t\t\t[attr.aria-label]=\"'BUTTONS.REMOVE' | translate\"\n\t\t\t\t\t\t[nbTooltip]=\"'BUTTONS.REMOVE' | translate\"\n\t\t\t\t\t\t(click)=\"removeDepartment(entity.id)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</li>\n\t\t\t}\n\t\t</ul>\n\t}\n</section>\n", styles: [":host{display:flex;flex-direction:column;min-height:0}.membership{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;background-color:var(--gauzy-card-3);border:1px solid var(--gauzy-border-default-color);border-radius:var(--border-radius)}.membership__header{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.875rem 1.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}.membership__title{margin:0;font-size:var(--text-subtitle-2-font-size);font-weight:500;line-height:1.125rem;color:var(--gauzy-text-color-1)}.membership__add{display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem;border-bottom:1px solid var(--gauzy-border-default-color)}.membership__select{flex:1 1 auto;min-width:0}.membership__add-actions{display:flex;flex:0 0 auto;gap:.5rem}.membership__list{list-style:none;margin:0;padding:.5rem 0;flex:1 1 auto;min-height:0;overflow-y:auto}.membership__row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem 1.25rem;min-height:2.5rem;transition:background-color .15s ease-in-out}.membership__row:hover{background-color:var(--gauzy-sidebar-background-4)}.membership__name{min-width:0;font-size:var(--text-subtitle-2-font-size);font-weight:var(--text-paragraph-font-weight);line-height:1.125rem;color:var(--gauzy-text-color-1);overflow-wrap:anywhere}.membership__remove{flex:0 0 auto;opacity:.55;transition:opacity .15s ease-in-out}.membership__remove nb-icon{font-size:1rem;width:1rem;height:1rem}.membership__row:hover .membership__remove,.membership__remove:hover,.membership__remove:focus-visible{opacity:1}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.Store }], propDecorators: { organizationEntities: [{
                type: Input
            }], employeeEntities: [{
                type: Input
            }], selectedEmployee: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], title: [{
                type: Input
            }], entitiesAdded: [{
                type: Output
            }], entitiesRemoved: [{
                type: Output
            }] } });
//# sourceMappingURL=edit-employee-membership-form.component.js.map