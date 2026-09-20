import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { map, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { ContactType, PermissionsEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { OrganizationContactService, ErrorHandlingService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "@angular/common";
let ContactSelectComponent = class ContactSelectComponent extends TranslationBaseComponent {
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get clearable() {
        return this._clearable;
    }
    set clearable(value) {
        this._clearable = value;
    }
    get addTag() {
        return this._addTag;
    }
    set addTag(value) {
        this._addTag = value;
    }
    get searchable() {
        return this._searchable;
    }
    set searchable(value) {
        this._searchable = value;
    }
    set organizationContact(val) {
        this._organizationContact = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get organizationContact() {
        return this._organizationContact;
    }
    constructor(translateService, store, toastrService, errorHandler, organizationContactService) {
        super(translateService);
        this.translateService = translateService;
        this.store = store;
        this.toastrService = toastrService;
        this.errorHandler = errorHandler;
        this.organizationContactService = organizationContactService;
        this.contacts = [];
        this.subject$ = new Subject();
        /*
         * Getter & Setter for dynamic enabled/disabled element
         */
        this._disabled = false;
        /*
         * Getter & Setter for dynamic add tag option
         */
        this._addTag = false;
        /*
         * Getter & Setter for dynamic searchable option
         */
        this._searchable = true;
        this.onChange = () => { };
        this.onTouched = () => { };
        this.onChanged = new EventEmitter();
        /**
         * Adds a new organization contact with the specified name.
         *
         * @param name The name of the contact to add.
         * @returns A promise that resolves to the created organization contact object.
         */
        this.addOrganizationContact = async (name) => {
            if (!this.organization) {
                return null;
            }
            const { tenantId } = this.store.user;
            const { id: organizationId } = this.organization;
            try {
                const contact = await this.organizationContactService.create({
                    name,
                    contactType: ContactType.CLIENT,
                    organizationId,
                    organization: { id: organizationId },
                    tenantId,
                    tenant: { id: tenantId }
                });
                this.toastrService.success(this.getTranslation('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_CONTACTS.ADD_CONTACT', { name }), this.getTranslation('TOASTR.TITLE.SUCCESS'));
                return contact;
            }
            catch (error) {
                this.errorHandler.handleError(error);
                // Optionally, re-throw or return null to indicate failure
                return null;
            }
        };
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(100), tap(() => this.getContacts()), untilDestroyed(this))
            .subscribe();
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
        this.hasEditEmployee$ = this.store.userRolePermissions$.pipe(map(() => this.store.hasPermission(PermissionsEnum.ORG_EMPLOYEES_EDIT)));
    }
    async getContacts() {
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { items = [] } = await this.organizationContactService.getAll([], {
            organizationId,
            tenantId
        });
        this.contacts = items;
    }
    writeValue(value) {
        if (value) {
            this._organizationContact = value;
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
    selectContact(contact) {
        this.organizationContact = contact;
        this.onChanged.emit(contact);
    }
    searchContact(term, item) {
        if (item.name) {
            return item.name.toLowerCase().includes(term.toLowerCase());
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectComponent, deps: [{ token: i1.TranslateService }, { token: i2.Store }, { token: i2.ToastrService }, { token: i2.ErrorHandlingService }, { token: i2.OrganizationContactService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ContactSelectComponent, isStandalone: false, selector: "ga-contact-select", inputs: { disabled: "disabled", placeholder: "placeholder", clearable: "clearable", addTag: "addTag", searchable: "searchable" }, outputs: { onChanged: "onChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ContactSelectComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<ng-select\n\t[addTag]=\"((hasEditEmployee$ | async) && addTag) ? addOrganizationContact : null\"\n\t[clearable]=\"clearable\"\n\t[disabled]=\"disabled\"\n\t[searchable]=\"searchable\"\n\t[items]=\"contacts\"\n\t(change)=\"selectContact($event)\"\n\t[(ngModel)]=\"organizationContact\"\n\t[placeholder]=\"placeholder || 'POP_UPS.ALL_CONTACTS' | translate\"\n\tbindLabel=\"name\"\n\t[searchFn]=\"searchContact\"\n\tappendTo=\"body\"\n>\n\t<ng-template\n\t\tng-option-tmp\n\t\tlet-item=\"item\"\n\t\tlet-index=\"index\"\n\t>\n\t\t{{ item.name }}\n\t</ng-template>\n\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t<div class=\"selector-template\">\n\t\t\t<span>{{ item.name }}</span>\n\t\t</div>\n\t</ng-template>\n</ng-select>", dependencies: [{ kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i4.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ContactSelectComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        Store,
        ToastrService,
        ErrorHandlingService,
        OrganizationContactService])
], ContactSelectComponent);
export { ContactSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-contact-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ContactSelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<ng-select\n\t[addTag]=\"((hasEditEmployee$ | async) && addTag) ? addOrganizationContact : null\"\n\t[clearable]=\"clearable\"\n\t[disabled]=\"disabled\"\n\t[searchable]=\"searchable\"\n\t[items]=\"contacts\"\n\t(change)=\"selectContact($event)\"\n\t[(ngModel)]=\"organizationContact\"\n\t[placeholder]=\"placeholder || 'POP_UPS.ALL_CONTACTS' | translate\"\n\tbindLabel=\"name\"\n\t[searchFn]=\"searchContact\"\n\tappendTo=\"body\"\n>\n\t<ng-template\n\t\tng-option-tmp\n\t\tlet-item=\"item\"\n\t\tlet-index=\"index\"\n\t>\n\t\t{{ item.name }}\n\t</ng-template>\n\t<ng-template ng-label-tmp let-item=\"item\">\n\t\t<div class=\"selector-template\">\n\t\t\t<span>{{ item.name }}</span>\n\t\t</div>\n\t</ng-template>\n</ng-select>" }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.Store }, { type: i2.ToastrService }, { type: i2.ErrorHandlingService }, { type: i2.OrganizationContactService }], propDecorators: { disabled: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], clearable: [{
                type: Input
            }], addTag: [{
                type: Input
            }], searchable: [{
                type: Input
            }], onChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=contact-select.component.js.map