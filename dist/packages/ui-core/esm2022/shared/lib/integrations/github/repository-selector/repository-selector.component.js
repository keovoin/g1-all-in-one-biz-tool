import { __decorate, __metadata } from "tslib";
import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorHandlingService, GithubService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
let RepositorySelectorComponent = class RepositorySelectorComponent {
    /**
     * Setter for the integration property.
     * Updates the integration and notifies observers with the new value.
     */
    set integration(value) {
        if (value) {
            this._integration = value;
            this.subject$.next(value); // Emit the updated value to observers
        }
    }
    /**
     * Getter for the integration property.
     * Returns the current integration value.
     */
    get integration() {
        return this._integration;
    }
    /**
     * Setter for the sourceId property.
     * Updates the source ID and triggers relevant changes when a valid value is provided.
     */
    set sourceId(val) {
        if (val) {
            // Check if the conversion was successful
            this._sourceId = val;
            this.onChange(this._sourceId); // Trigger the onChange event with the converted number
            this.onTouched(); // Mark the field as touched
            // Handle pre-selected repository if applicable
            if (this.selected) {
                this._preSelectedRepository(this._sourceId); // Pre-select the repository
            }
        }
    }
    /**
     * Getter for the sourceId property.
     * Returns the current source ID value.
     */
    get sourceId() {
        return this._sourceId;
    }
    constructor(_store, _githubService, _errorHandlingService) {
        this._store = _store;
        this._githubService = _githubService;
        this._errorHandlingService = _errorHandlingService;
        this.preSelected = false;
        this.loading = false;
        this.subject$ = new Subject();
        this.organization = this._store.selectedOrganization;
        this.repositories = [];
        /**
         * Placeholder text to guide the user. Defaults to null if not provided.
         */
        this.placeholder = null;
        /**
         * Indicates whether the component is selected. Defaults to false.
         */
        this.selected = false;
        /** */
        this.onChanged = new EventEmitter();
        this.afterLoad = new EventEmitter();
        // Implement your onChange and onTouched methods
        this.onChange = () => { };
        this.onTouched = () => { };
        this.subject$
            .pipe(tap(() => this._getRepositories()), untilDestroyed(this))
            .subscribe();
    }
    ngOnInit() { }
    /**
     * Pre-selects a repository based on the provided source ID.
     *
     * @param sourceId - The ID of the source repository to pre-select.
     */
    _preSelectedRepository(sourceId) {
        const repository = this.repositories.find((repo) => repo.id === sourceId);
        if (repository) {
            this.selectRepository(repository); // Select the found repository
        }
    }
    /**
     * Fetches repositories for a given integration and organization.
     */
    _getRepositories() {
        if (!this.integration)
            return; // Ensure a valid integration is present
        this.loading = true;
        // Destructure required properties from the integration object
        const { id: integrationId, organizationId, tenantId } = this.integration;
        // Fetch the repositories using the integration details
        const repositories$ = this._githubService.getRepositories(integrationId, {
            organizationId,
            tenantId
        });
        this.repositories$ = repositories$.pipe(map(({ repositories }) => repositories), 
        // Update component state with fetched repositories
        tap((repositories) => {
            this.repositories = repositories;
            this.afterLoad.emit(this.repositories || []);
        }), catchError((error) => {
            // Handle and log errors
            this._errorHandlingService.handleError(error);
            return of([]);
        }), finalize(() => {
            // Set loading to false once finished
            this.loading = false;
        }), 
        // Handle component lifecycle to avoid memory leaks
        untilDestroyed(this));
    }
    /**
     * Selects a GitHub repository and emits the selection event.
     *
     * @param repository - The selected GitHub repository.
     */
    selectRepository(repository) {
        if (repository) {
            this.onChanged.emit(repository); // Emit the selected repository
        }
    }
    /**
     * Write the value (repository ID) into the component.
     *
     * @param value - The value to be written, representing the repository ID.
     */
    writeValue(value) {
        this._sourceId = value; // Assign the provided value to _sourceId
    }
    /**
     * Register a function to call when the control's value changes.
     *
     * @param fn - The function that handles value changes.
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Register a function to call when the control is touched.
     *
     * @param fn - The function that handles touch events.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RepositorySelectorComponent, deps: [{ token: i1.Store }, { token: i1.GithubService }, { token: i1.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RepositorySelectorComponent, isStandalone: false, selector: "ngx-github-repository-selector", inputs: { placeholder: "placeholder", selected: "selected", integration: "integration", sourceId: "sourceId" }, outputs: { onChanged: "onChanged", afterLoad: "afterLoad" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => RepositorySelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"form-group\">\n  <label class=\"label\">\n    {{ 'FORM.LABELS.GITHUB_REPOSITORY' | translate }}\n  </label>\n  <ng-select\n    #select\n    class=\"mb-2\"\n    [items]=\"repositories$ | async\"\n    [searchable]=\"false\"\n    [clearable]=\"true\"\n    [loading]=\"loading\"\n    [(ngModel)]=\"sourceId\"\n    [placeholder]=\"placeholder || ('INTEGRATIONS.GITHUB_PAGE.SELECT_REPOSITORY' | translate)\"\n    bindLabel=\"full_name\"\n    bindValue=\"id\"\n    appendTo=\"body\"\n    dropdownPosition=\"bottom\"\n    (change)=\"selectRepository($event)\"\n    >\n    <ng-template ng-header-tmp>\n      <input\n        type=\"search\"\n        class=\"form-control\"\n        (input)=\"select.filter($event.target.value)\"\n        [placeholder]=\"'INTEGRATIONS.GITHUB_PAGE.SEARCH_REPOSITORY' | translate\"\n        />\n      </ng-template>\n      <ng-template ng-label-tmp let-item=\"item\">\n        @if (item) {\n          <img src=\"assets/images/integrations/github.svg\" />\n          <span class=\"ml-1\">{{ item.full_name }}</span>\n        }\n      </ng-template>\n      <ng-template ng-option-tmp let-item=\"item\">\n        @if (item) {\n          <img src=\"assets/images/integrations/github.svg\" />\n          <span class=\"ml-1\">{{ item.full_name }}</span>\n        }\n      </ng-template>\n    </ng-select>\n  </div>\n", styles: [":host{min-width:200px;display:block}:host nb-select{max-width:none}:host img{width:28px;height:28px;border-radius:nb-theme(border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}\n"], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i3.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i3.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "directive", type: i3.NgHeaderTemplateDirective, selector: "[ng-header-tmp]" }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
RepositorySelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        GithubService,
        ErrorHandlingService])
], RepositorySelectorComponent);
export { RepositorySelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RepositorySelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-github-repository-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => RepositorySelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<div class=\"form-group\">\n  <label class=\"label\">\n    {{ 'FORM.LABELS.GITHUB_REPOSITORY' | translate }}\n  </label>\n  <ng-select\n    #select\n    class=\"mb-2\"\n    [items]=\"repositories$ | async\"\n    [searchable]=\"false\"\n    [clearable]=\"true\"\n    [loading]=\"loading\"\n    [(ngModel)]=\"sourceId\"\n    [placeholder]=\"placeholder || ('INTEGRATIONS.GITHUB_PAGE.SELECT_REPOSITORY' | translate)\"\n    bindLabel=\"full_name\"\n    bindValue=\"id\"\n    appendTo=\"body\"\n    dropdownPosition=\"bottom\"\n    (change)=\"selectRepository($event)\"\n    >\n    <ng-template ng-header-tmp>\n      <input\n        type=\"search\"\n        class=\"form-control\"\n        (input)=\"select.filter($event.target.value)\"\n        [placeholder]=\"'INTEGRATIONS.GITHUB_PAGE.SEARCH_REPOSITORY' | translate\"\n        />\n      </ng-template>\n      <ng-template ng-label-tmp let-item=\"item\">\n        @if (item) {\n          <img src=\"assets/images/integrations/github.svg\" />\n          <span class=\"ml-1\">{{ item.full_name }}</span>\n        }\n      </ng-template>\n      <ng-template ng-option-tmp let-item=\"item\">\n        @if (item) {\n          <img src=\"assets/images/integrations/github.svg\" />\n          <span class=\"ml-1\">{{ item.full_name }}</span>\n        }\n      </ng-template>\n    </ng-select>\n  </div>\n", styles: [":host{min-width:200px;display:block}:host nb-select{max-width:none}:host img{width:28px;height:28px;border-radius:nb-theme(border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.GithubService }, { type: i1.ErrorHandlingService }], propDecorators: { placeholder: [{
                type: Input
            }], selected: [{
                type: Input
            }], integration: [{
                type: Input
            }], sourceId: [{
                type: Input
            }], onChanged: [{
                type: Output
            }], afterLoad: [{
                type: Output
            }] } });
//# sourceMappingURL=repository-selector.component.js.map