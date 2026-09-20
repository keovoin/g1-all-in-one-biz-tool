import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { LanguagesService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getLanguageFlagUrl } from './language-flag';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@nebular/theme";
import * as i4 from "@angular/forms";
import * as i5 from "@ng-select/ng-select";
let LanguageSelectorComponent = class LanguageSelectorComponent extends TranslationBaseComponent {
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
    get selectedLanguageCode() {
        return this._selectedLanguageCode;
    }
    set selectedLanguageCode(value) {
        if (value) {
            this._selectedLanguageCode = value;
            this.onChange(value);
            this.onTouch(value);
        }
    }
    get template() {
        return this._template;
    }
    set template(value) {
        this._template = value;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
    }
    constructor(languagesService, translate, store, cd) {
        super(translate);
        this.languagesService = languagesService;
        this.translate = translate;
        this.store = store;
        this.cd = cd;
        this.onChange = () => { };
        this.onTouch = () => { };
        /*
         * Getter & Setter for dynamic placeholder
         */
        this._placeholder = this.getTranslation('MENU.LANGUAGE');
        /*
         * Getter & Setter for automatic language selection as per selected language
         */
        this.selectBy = 'code';
        /*
         * Getter & Setter for dynamic template size
         */
        this._size = 'medium';
        this.selectedLanguageEvent = new EventEmitter();
        this.addLanguage = async (languageName) => {
            const newLanguage = {
                name: languageName,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                description: ''
            };
            this.loading = true;
            const language = await this.languagesService.insertLanguage(newLanguage);
            this.loading = false;
            return language;
        };
        this.store.preferredLanguage$
            .pipe(filter((preferredLanguage) => !!preferredLanguage), tap((preferredLanguage) => (this.selectedLanguageCode = preferredLanguage)), untilDestroyed(this))
            .subscribe();
    }
    onChangeLanguage(currentSelection) {
        let selectedLanguage;
        if (this.selectBy === 'object') {
            selectedLanguage = currentSelection;
        }
        else {
            selectedLanguage = currentSelection?.code || this.selectedLanguageCode;
        }
        this.selectedLanguageEvent.emit(selectedLanguage);
    }
    onSelectedChange(code) {
        this.cd.detectChanges();
        let selectedLanguage;
        if (this.selectBy === 'object') {
            selectedLanguage = this.getLanguageByCode(code);
        }
        else {
            selectedLanguage = code || this.selectedLanguageCode;
        }
        this.selectedLanguageEvent.emit(selectedLanguage);
    }
    writeValue(value) {
        this._selectedLanguageCode = value;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    async ngOnInit() {
        await this.getAllLanguages();
        if (this.selectBy === 'object') {
            this.checkPreFilledLanguage();
        }
    }
    async getAllLanguages() {
        const { items } = await this.languagesService.getAllLanguages();
        this.languages = items;
    }
    checkPreFilledLanguage() {
        if (!this.selectedLanguageCode) {
            return;
        }
        if (this.languages?.length > 0) {
            const selectedLanguage = this.getLanguageByCode(this.selectedLanguageCode);
            this.onChangeLanguage(selectedLanguage);
        }
    }
    getLanguageByCode(code) {
        return this.languages.find((language) => code === language.code);
    }
    /**
     * Currently selected language (drives the flag + name shown in the closed nb-select trigger).
     */
    get selectedLanguage() {
        return this.languages?.find((language) => language.code === this._selectedLanguageCode);
    }
    /**
     * Flag asset URL for a language code (null when no flag is vendored).
     */
    getFlagUrl(code) {
        return getLanguageFlagUrl(code);
    }
    /**
     * Hides a flag image that failed to load, leaving the plain language name.
     */
    onFlagError(event) {
        event.target.style.display = 'none';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageSelectorComponent, deps: [{ token: i1.LanguagesService }, { token: i2.TranslateService }, { token: i1.Store }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: LanguageSelectorComponent, isStandalone: false, selector: "ngx-language-selector", inputs: { placeholder: "placeholder", clearable: "clearable", addTag: "addTag", selectedLanguageCode: "selectedLanguageCode", selectBy: "selectBy", labelForId: "labelForId", template: "template", size: "size" }, outputs: { selectedLanguageEvent: "selectedLanguageEvent" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => LanguageSelectorComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "@if (_template === 'ng-select') {\n  <ng-select\n    class=\"language-select\"\n    [items]=\"languages\"\n    appendTo=\"body\"\n    bindLabel=\"name\"\n    bindValue=\"code\"\n    [loading]=\"loading\"\n    [addTag]=\"(addTag) ? addLanguage : null\"\n    (change)=\"onChangeLanguage($event)\"\n    [closeOnSelect]=\"true\"\n    [clearable]=\"clearable\"\n    [placeholder]=\"placeholder\"\n    [labelForId]=\"labelForId\"\n    [(ngModel)]=\"selectedLanguageCode\"\n  >\n    <ng-template ng-label-tmp let-item=\"item\">\n      <span class=\"language-option\">\n        @if (getFlagUrl(item?.code); as flagUrl) {\n          <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n        }\n        <span class=\"language-option-name\">{{ item?.name }}</span>\n      </span>\n    </ng-template>\n    <ng-template ng-option-tmp let-item=\"item\">\n      <span class=\"language-option\">\n        @if (getFlagUrl(item?.code); as flagUrl) {\n          <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n        }\n        <span class=\"language-option-name\">{{ item?.name }}</span>\n      </span>\n    </ng-template>\n    <ng-template ng-tag-tmp let-newLanguageName=\"searchTerm\">\n      <b>{{ 'LANGUAGE_PAGE.ADD_NEW_LANGUAGE' | translate }}</b>: {{ newLanguageName }}\n    </ng-template>\n  </ng-select>\n} @else {\n  <nb-select\n    fullWidth\n    (selectedChange)=\"onSelectedChange($event)\"\n    [size]=\"size\"\n    [placeholder]=\"placeholder\"\n    [(ngModel)]=\"selectedLanguageCode\"\n  >\n    <nb-select-label>\n      <span class=\"language-option\">\n        @if (getFlagUrl(selectedLanguage?.code); as flagUrl) {\n          <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n        }\n        <span class=\"language-option-name\">{{ selectedLanguage?.name }}</span>\n      </span>\n    </nb-select-label>\n    @for (language of languages; track language) {\n      <nb-option [value]=\"language.code\">\n        <span class=\"language-option\">\n          @if (getFlagUrl(language.code); as flagUrl) {\n            <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n          }\n          <span class=\"language-option-name\">{{ language.name }}</span>\n        </span>\n      </nb-option>\n    }\n  </nb-select>\n}\n", styles: [".language-option{display:inline-flex;align-items:center;gap:.375rem;min-width:0;max-width:100%;vertical-align:middle}.flag-icon{flex:0 0 auto;width:1.125rem;height:.75rem;border-radius:2px;object-fit:cover}.language-option-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n"], dependencies: [{ kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbSelectLabelComponent, selector: "nb-select-label" }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i5.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i5.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "directive", type: i5.NgTagTemplateDirective, selector: "[ng-tag-tmp]" }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
};
LanguageSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [LanguagesService,
        TranslateService,
        Store,
        ChangeDetectorRef])
], LanguageSelectorComponent);
export { LanguageSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguageSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-language-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => LanguageSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "@if (_template === 'ng-select') {\n  <ng-select\n    class=\"language-select\"\n    [items]=\"languages\"\n    appendTo=\"body\"\n    bindLabel=\"name\"\n    bindValue=\"code\"\n    [loading]=\"loading\"\n    [addTag]=\"(addTag) ? addLanguage : null\"\n    (change)=\"onChangeLanguage($event)\"\n    [closeOnSelect]=\"true\"\n    [clearable]=\"clearable\"\n    [placeholder]=\"placeholder\"\n    [labelForId]=\"labelForId\"\n    [(ngModel)]=\"selectedLanguageCode\"\n  >\n    <ng-template ng-label-tmp let-item=\"item\">\n      <span class=\"language-option\">\n        @if (getFlagUrl(item?.code); as flagUrl) {\n          <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n        }\n        <span class=\"language-option-name\">{{ item?.name }}</span>\n      </span>\n    </ng-template>\n    <ng-template ng-option-tmp let-item=\"item\">\n      <span class=\"language-option\">\n        @if (getFlagUrl(item?.code); as flagUrl) {\n          <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n        }\n        <span class=\"language-option-name\">{{ item?.name }}</span>\n      </span>\n    </ng-template>\n    <ng-template ng-tag-tmp let-newLanguageName=\"searchTerm\">\n      <b>{{ 'LANGUAGE_PAGE.ADD_NEW_LANGUAGE' | translate }}</b>: {{ newLanguageName }}\n    </ng-template>\n  </ng-select>\n} @else {\n  <nb-select\n    fullWidth\n    (selectedChange)=\"onSelectedChange($event)\"\n    [size]=\"size\"\n    [placeholder]=\"placeholder\"\n    [(ngModel)]=\"selectedLanguageCode\"\n  >\n    <nb-select-label>\n      <span class=\"language-option\">\n        @if (getFlagUrl(selectedLanguage?.code); as flagUrl) {\n          <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n        }\n        <span class=\"language-option-name\">{{ selectedLanguage?.name }}</span>\n      </span>\n    </nb-select-label>\n    @for (language of languages; track language) {\n      <nb-option [value]=\"language.code\">\n        <span class=\"language-option\">\n          @if (getFlagUrl(language.code); as flagUrl) {\n            <img class=\"flag-icon\" [src]=\"flagUrl\" (error)=\"onFlagError($event)\" width=\"18\" height=\"12\" alt=\"\" />\n          }\n          <span class=\"language-option-name\">{{ language.name }}</span>\n        </span>\n      </nb-option>\n    }\n  </nb-select>\n}\n", styles: [".language-option{display:inline-flex;align-items:center;gap:.375rem;min-width:0;max-width:100%;vertical-align:middle}.flag-icon{flex:0 0 auto;width:1.125rem;height:.75rem;border-radius:2px;object-fit:cover}.language-option-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n"] }]
        }], ctorParameters: () => [{ type: i1.LanguagesService }, { type: i2.TranslateService }, { type: i1.Store }, { type: i0.ChangeDetectorRef }], propDecorators: { placeholder: [{
                type: Input
            }], clearable: [{
                type: Input
            }], addTag: [{
                type: Input
            }], selectedLanguageCode: [{
                type: Input
            }], selectBy: [{
                type: Input
            }], labelForId: [{
                type: Input
            }], template: [{
                type: Input
            }], size: [{
                type: Input
            }], selectedLanguageEvent: [{
                type: Output
            }] } });
//# sourceMappingURL=language-selector.component.js.map