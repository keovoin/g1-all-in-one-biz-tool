import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { ErrorHandlingService, ProposalTemplateService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
let ProposalTemplateSelectComponent = class ProposalTemplateSelectComponent {
    get employeeId() {
        return this._employeeId;
    }
    set employeeId(value) {
        this._employeeId = value;
        this.subject$.next(true);
    }
    set proposalTemplateId(val) {
        this._proposalTemplateId = val;
        // Emit selected proposal template
        this.onChange(val);
        this.onTouched(val);
    }
    get proposalTemplateId() {
        return this._proposalTemplateId;
    }
    constructor(_proposalTemplateService, _store, _errorHandlingService) {
        this._proposalTemplateService = _proposalTemplateService;
        this._store = _store;
        this._errorHandlingService = _errorHandlingService;
        this.proposalTemplates = [];
        this.subject$ = new Subject();
        this.onChange = () => { };
        this.onTouched = () => { };
        this.disabled = false;
        this.multiple = false;
        this.selectedChange = new EventEmitter();
    }
    ngOnInit() {
        this.subject$
            .pipe(debounceTime(500), tap(() => this.getProposalTemplates()), untilDestroyed(this))
            .subscribe();
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.subject$.next(true)), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Write value
     * @param value - The value to be written, can be a string or an array of strings
     */
    writeValue(value) {
        if (this.multiple) {
            this._proposalTemplateId = value instanceof Array ? value : [value];
        }
        else {
            this._proposalTemplateId = value;
        }
    }
    /**
     * On selected change
     * @param selectedItem - The ID of the selected item
     */
    onSelectedChange(selectedItem) {
        const proposalTemplate = this.proposalTemplates.find(({ id }) => id === selectedItem);
        this.selectedChange.emit(proposalTemplate || null);
    }
    /**
     * Register on change
     * @param fn - A function that takes a number (rating) as an argument and returns void
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Register on touched
     * @param fn - A function that takes no arguments and returns void
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Set disabled state
     * @param isDisabled - A boolean indicating whether the control should be disabled
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * Get proposal templates
     */
    async getProposalTemplates() {
        try {
            const { id: organizationId, tenantId } = this.organization;
            const { employeeId } = this;
            const { items = [] } = await this._proposalTemplateService.getAll({
                where: {
                    organizationId,
                    tenantId,
                    ...(employeeId ? { employeeId } : {})
                }
            });
            this.proposalTemplates = items;
            this.defaultSelectedTemplate();
        }
        catch (error) {
            console.log('Error while getting proposal templates', error);
            // Handle and log errors
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Set default selected proposal template
     */
    defaultSelectedTemplate() {
        // Find default proposal template
        const proposalTemplate = this.proposalTemplates.find(({ isDefault }) => isDefault === true);
        this.proposalTemplateId = proposalTemplate?.id || null;
        // Emit selected proposal template
        this.onSelectedChange(this.proposalTemplateId);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateSelectComponent, deps: [{ token: i1.ProposalTemplateService }, { token: i1.Store }, { token: i1.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProposalTemplateSelectComponent, isStandalone: false, selector: "ngx-proposal-template-select", inputs: { disabled: "disabled", multiple: "multiple", employeeId: "employeeId" }, outputs: { selectedChange: "selectedChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ProposalTemplateSelectComponent),
                multi: true
            }
        ], ngImport: i0, template: "<nb-select\n  class=\"multiple-select\"\n  [disabled]=\"disabled\"\n  [multiple]=\"multiple\"\n  [placeholder]=\"'PROPOSAL_TEMPLATE.SELECT_PROPOSAL_TEMPLATE' | translate\"\n  [(selected)]=\"proposalTemplateId\"\n  (selectedChange)=\"onSelectedChange($event)\"\n  >\n  @for (proposalTemplate of proposalTemplates; track proposalTemplate) {\n    <nb-option\n      [value]=\"proposalTemplate.id\"\n      >\n      {{ proposalTemplate.name }}\n    </nb-option>\n  }\n</nb-select>\n\n<ng-content></ng-content>\n", styles: [":host{display:block}:host nb-select{width:100%}\n"], dependencies: [{ kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
ProposalTemplateSelectComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [ProposalTemplateService,
        Store,
        ErrorHandlingService])
], ProposalTemplateSelectComponent);
export { ProposalTemplateSelectComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-proposal-template-select', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ProposalTemplateSelectComponent),
                            multi: true
                        }
                    ], standalone: false, template: "<nb-select\n  class=\"multiple-select\"\n  [disabled]=\"disabled\"\n  [multiple]=\"multiple\"\n  [placeholder]=\"'PROPOSAL_TEMPLATE.SELECT_PROPOSAL_TEMPLATE' | translate\"\n  [(selected)]=\"proposalTemplateId\"\n  (selectedChange)=\"onSelectedChange($event)\"\n  >\n  @for (proposalTemplate of proposalTemplates; track proposalTemplate) {\n    <nb-option\n      [value]=\"proposalTemplate.id\"\n      >\n      {{ proposalTemplate.name }}\n    </nb-option>\n  }\n</nb-select>\n\n<ng-content></ng-content>\n", styles: [":host{display:block}:host nb-select{width:100%}\n"] }]
        }], ctorParameters: () => [{ type: i1.ProposalTemplateService }, { type: i1.Store }, { type: i1.ErrorHandlingService }], propDecorators: { disabled: [{
                type: Input
            }], multiple: [{
                type: Input
            }], employeeId: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }] } });
//# sourceMappingURL=proposal-template-select.component.js.map