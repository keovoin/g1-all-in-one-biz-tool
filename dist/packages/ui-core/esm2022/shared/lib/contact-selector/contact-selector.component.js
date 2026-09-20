import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef } from '@angular/core';
import { ContactType, PermissionsEnum } from '@gauzy/contracts';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { ToastrService } from '@gauzy/ui-core/core';
import { OrganizationContactService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
let ContactSelectorComponent = class ContactSelectorComponent {
    get employeeId() {
        return this._employeeId;
    }
    set employeeId(value) {
        this._employeeId = value;
        this.subject$.next(true);
    }
    get contactId() {
        return this._contactId;
    }
    set contactId(val) {
        this._contactId = val;
        this.onChange(val);
        this.onTouched(val);
    }
    constructor(organizationContactService, store, toastrService) {
        this.organizationContactService = organizationContactService;
        this.store = store;
        this.toastrService = toastrService;
        this.contacts = [];
        this.disabled = false;
        this.multiple = false;
        /**
         * Prompt shown while nothing is selected. Left null so the template keeps
         * falling back to the generic "Client", for the call sites that render the
         * selector without a label of its own.
         */
        this.placeholder = null;
        this.subject$ = new Subject();
        this.onChange = () => { };
        this.onTouched = () => { };
        this.createNew = async (name) => {
            if (!this.organization || !name) {
                return;
            }
            const { tenantId } = this.store.user;
            const { id: organizationId } = this.organization;
            const members = [];
            if (this.employeeId) {
                members.push({ id: this.employeeId });
            }
            try {
                const contact = await this.organizationContactService.create({
                    name,
                    organizationId,
                    tenantId,
                    contactType: ContactType.CLIENT,
                    ...(isNotEmpty(members) ? { members } : {})
                });
                if (contact) {
                    this.contacts = this.contacts.concat([contact]);
                    this.contactId = contact.id;
                    this.toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_CLIENTS.ADD_CLIENT', {
                        name
                    });
                }
            }
            catch (error) {
                this.toastrService.error(error);
            }
        };
    }
    ngOnInit() {
        this.hasEditContact$ = this.store.userRolePermissions$.pipe(map(() => this.store.hasPermission(PermissionsEnum.ORG_CONTACT_EDIT)));
    }
    ngAfterViewInit() {
        this.subject$
            .pipe(tap(() => this.getContacts()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    async getContacts() {
        if (!this.organization) {
            return;
        }
        try {
            const { tenantId } = this.store.user;
            const { id: organizationId } = this.organization;
            if (this.employeeId) {
                const items = await this.organizationContactService.getAllByEmployee(this.employeeId, {
                    organizationId,
                    tenantId
                });
                this.contacts = items;
            }
            else {
                const { items = [] } = await this.organizationContactService.getAll([], {
                    organizationId,
                    tenantId
                });
                this.contacts = items;
            }
        }
        catch (error) {
            console.log('Error while retrieving organization contacts', error);
        }
    }
    writeValue(value) {
        if (this.multiple) {
            this._contactId = value instanceof Array ? value : [value];
        }
        else {
            this._contactId = value;
        }
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
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectorComponent, deps: [{ token: i1.OrganizationContactService }, { token: i1.Store }, { token: i1.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ContactSelectorComponent, isStandalone: false, selector: "ga-contact-selector", inputs: { disabled: "disabled", multiple: "multiple", placeholder: "placeholder", employeeId: "employeeId", contactId: "contactId" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ContactSelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "<!-- <nb-select\n\tclass=\"multiple-select\"\n\t[disabled]=\"disabled\"\n\t[multiple]=\"multiple\"\n\t[placeholder]=\"'TIMER_TRACKER.SELECT_CLIENT' | translate\"\n\t[(selected)]=\"contactId\"\n>\n\t<nb-option *ngFor=\"let contact of contacts\" [value]=\"contact.id\">\n\t\t{{ contact.name }}\n\t</nb-option>\n</nb-select> -->\n<ng-select\n\t[addTag]=\"(hasEditContact$ | async) ? createNew : null\"\n\t[disabled]=\"disabled\"\n\t[clearable]=\"true\"\n\t[items]=\"contacts\"\n\tappendTo=\"body\"\n\t[(ngModel)]=\"contactId\"\n\t[placeholder]=\"placeholder ?? ('TIMER_TRACKER.SELECT_CLIENT' | translate)\"\n\tbindValue=\"id\"\n\tbindLabel=\"name\"\n></ng-select>", styles: [":host{min-width:200px;display:block}:host nb-select{max-width:none}:host .multiple-select{width:100%}\n"], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
ContactSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [OrganizationContactService,
        Store,
        ToastrService])
], ContactSelectorComponent);
export { ContactSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-contact-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ContactSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<!-- <nb-select\n\tclass=\"multiple-select\"\n\t[disabled]=\"disabled\"\n\t[multiple]=\"multiple\"\n\t[placeholder]=\"'TIMER_TRACKER.SELECT_CLIENT' | translate\"\n\t[(selected)]=\"contactId\"\n>\n\t<nb-option *ngFor=\"let contact of contacts\" [value]=\"contact.id\">\n\t\t{{ contact.name }}\n\t</nb-option>\n</nb-select> -->\n<ng-select\n\t[addTag]=\"(hasEditContact$ | async) ? createNew : null\"\n\t[disabled]=\"disabled\"\n\t[clearable]=\"true\"\n\t[items]=\"contacts\"\n\tappendTo=\"body\"\n\t[(ngModel)]=\"contactId\"\n\t[placeholder]=\"placeholder ?? ('TIMER_TRACKER.SELECT_CLIENT' | translate)\"\n\tbindValue=\"id\"\n\tbindLabel=\"name\"\n></ng-select>", styles: [":host{min-width:200px;display:block}:host nb-select{max-width:none}:host .multiple-select{width:100%}\n"] }]
        }], ctorParameters: () => [{ type: i1.OrganizationContactService }, { type: i1.Store }, { type: i1.ToastrService }], propDecorators: { disabled: [{
                type: Input
            }], multiple: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], employeeId: [{
                type: Input
            }], contactId: [{
                type: Input
            }] } });
//# sourceMappingURL=contact-selector.component.js.map