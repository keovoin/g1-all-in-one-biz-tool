var ProposalRegisterComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NbDateService } from '@nebular/theme';
import moment from 'moment';
import { distinctUntilChange, isNotEmpty } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ErrorHandlingService, OrganizationSettingService, ProposalsService, Store, ToastrService, UrlPatternValidator } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/forms";
import * as i3 from "@gauzy/ui-core/core";
import * as i4 from "@angular/router";
import * as i5 from "@nebular/theme";
import * as i6 from "@gauzy/ui-core/shared";
let ProposalRegisterComponent = class ProposalRegisterComponent extends TranslationBaseComponent {
    static { ProposalRegisterComponent_1 = this; }
    static buildForm(fb, self) {
        return fb.group({
            jobPostUrl: [],
            valueDate: [self._organizationSettingService.getDateFromOrganizationSettings(), Validators.required],
            jobPostContent: ['', Validators.required],
            proposalContent: ['', Validators.required],
            tags: [],
            organizationContact: [],
            employee: []
        }, {
            validators: [UrlPatternValidator.websiteUrlValidator('jobPostUrl')]
        });
    }
    constructor(translateService, _fb, _store, _router, _dateService, _proposalsService, _toastrService, _cdRef, _organizationSettingService, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._fb = _fb;
        this._store = _store;
        this._router = _router;
        this._dateService = _dateService;
        this._proposalsService = _proposalsService;
        this._toastrService = _toastrService;
        this._cdRef = _cdRef;
        this._organizationSettingService = _organizationSettingService;
        this._errorHandlingService = _errorHandlingService;
        /*
         * Payment Mutation Form
         */
        this.form = ProposalRegisterComponent_1.buildForm(this._fb, this);
        this.minDate = this._dateService.addMonth(this._dateService.today(), 0);
    }
    ngOnInit() {
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this._cdRef.detectChanges();
    }
    /**
     * Select Employee Selector
     *
     * @param employee
     */
    selectionEmployee(employee) {
        if (employee) {
            this.form.patchValue({ employee: employee });
            this.form.updateValueAndValidity();
        }
        this.proposalTemplateId = null;
    }
    /**
     * Updates the 'proposalContent' field in the form based on a given template.
     *
     * @param item An `IEmployeeProposalTemplate` object. If `null` or empty, the 'proposalContent' field is set to `null`.
     */
    onProposalTemplateChange(item) {
        // Check if the provided item is not empty
        if (isNotEmpty(item)) {
            // Set 'proposalContent' field in the form with the content from the item
            this.form.patchValue({ proposalContent: item.content });
        }
        else {
            // If item is empty or null, clear 'proposalContent' field
            this.form.patchValue({ proposalContent: null });
        }
        // Ensure the form updates its state after patching values
        this.form.updateValueAndValidity();
    }
    /**
     * Registers a new proposal based on the form input, validating required conditions.
     *
     * If the form is valid and an organization is set, it extracts relevant data from the form,
     * creates a proposal via the proposalsService, and navigates to the appropriate page.
     *
     * Displays success or error messages based on the operation's outcome.
     *
     * @returns A promise that resolves when the proposal is registered or rejects with an error.
     */
    async registerProposal() {
        // Return early if organization is not set or form is invalid
        if (!this.organization || this.form.invalid) {
            return;
        }
        const { jobPostUrl, valueDate, jobPostContent, proposalContent, organizationContact, tags = [], employee } = this.form.value; // Extract form values
        if (!employee) {
            // No employee selected, show a specific message
            this._toastrService.success('NOTES.PROPOSALS.REGISTER_PROPOSAL_NO_EMPLOYEE_SELECTED', null, 'TOASTR.MESSAGE.REGISTER_PROPOSAL_NO_EMPLOYEE_MSG');
            return; // Exit early if no employee is selected
        }
        try {
            const { id: organizationId, tenantId } = this.organization; // Extract current tenant ID & organization ID
            // Create the new proposal with the collected data
            await this._proposalsService.create({
                organizationId,
                tenantId,
                jobPostUrl,
                valueDate: moment(valueDate).startOf('day').toDate(), // Start of day to avoid time discrepancies
                jobPostContent,
                proposalContent,
                employee: { id: employee.id },
                employeeId: employee.id,
                organizationContact: { id: organizationContact.id },
                organizationContactId: organizationContact.id,
                tags
            });
            // Show success message and navigate to the sales/proposals page with query params
            this._toastrService.success('NOTES.PROPOSALS.REGISTER_PROPOSAL');
            // Navigate to the proposals page with query params
            this._router.navigate(['/pages/sales/proposals'], {
                queryParams: { date: moment(valueDate).format('MM-DD-YYYY') }
            });
        }
        catch (error) {
            // Handle error cases, show an appropriate message
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Sets the 'organizationContact' field on the form with the given value.
     *
     * @param organizationContact The selected organization contact to be set in the form.
     */
    selectOrganizationContact(contact) {
        this.form.get('organizationContact').setValue(contact);
        this.form.get('organizationContact').updateValueAndValidity();
    }
    /**
     * Sets the 'tags' field on the form with the given list of tags.
     *
     * @param tags An array of selected tags to be set in the form.
     */
    selectedTagsEvent(tags) {
        this.form.get('tags').setValue(tags);
        this.form.get('tags').updateValueAndValidity();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalRegisterComponent, deps: [{ token: i1.TranslateService }, { token: i2.UntypedFormBuilder }, { token: i3.Store }, { token: i4.Router }, { token: i5.NbDateService }, { token: i3.ProposalsService }, { token: i3.ToastrService }, { token: i0.ChangeDetectorRef }, { token: i3.OrganizationSettingService }, { token: i3.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProposalRegisterComponent, isStandalone: false, selector: "ga-proposal-register", usesInheritance: true, ngImport: i0, template: "<nb-card class=\"card\">\n\t<nb-card-header class=\"d-flex card-header\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h4>\n\t\t\t<ngx-header-title>\n\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.REGISTER_PROPOSALS' | translate }}\n\t\t\t</ngx-header-title>\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body class=\"card-body\">\n\t\t<form [formGroup]=\"form\" #proposalForm=\"ngForm\" (ngSubmit)=\"registerProposal()\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.AUTHOR' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t\tid=\"authorInput\"\n\t\t\t\t\t\t\t\tclass=\"employees\"\n\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t[defaultSelected]=\"true\"\n\t\t\t\t\t\t\t\t(selectionChanged)=\"selectionEmployee($event)\"\n\t\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\"> {{ 'PROPOSALS_PAGE.REGISTER.TEMPLATE' | translate }}</label>\n\t\t\t\t\t\t\t<ngx-proposal-template-select\n\t\t\t\t\t\t\t\t(selectedChange)=\"onProposalTemplateChange($event)\"\n\t\t\t\t\t\t\t\t[ngModelOptions]=\"{ standalone: true }\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"proposalTemplateId\"\n\t\t\t\t\t\t\t\t[employeeId]=\"selectedEmployee?.id\"\n\t\t\t\t\t\t\t></ngx-proposal-template-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.CONTACT' | translate }}</label>\n\t\t\t\t\t\t\t<ga-contact-select\n\t\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t(onChanged)=\"selectOrganizationContact($event)\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.CONTACT' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ga-contact-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-xl-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'PROPOSALS_PAGE.REGISTER.JOB_POST_URL' | translate }} </label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROPOSALS_PAGE.REGISTER.JOB_POST_URL' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"jobPostUrl\"\n\t\t\t\t\t\t\t\tautocomplete=\"on\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'PROPOSALS_PAGE.REGISTER.PROPOSAL_DATE' | translate }} </label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tformControlName=\"valueDate\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROPOSALS_PAGE.REGISTER.PROPOSAL_DATE' | translate\"\n\t\t\t\t\t\t\t\t[nbDatepicker]=\"valueDatePicker\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t<nb-datepicker [min]=\"minDate\" #valueDatePicker></nb-datepicker>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-xl-6\">\n\t\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.JOB_POST_CONTENT' | translate }}\n\t\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t\t<nb-card-body>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"jobPostContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t\t</nb-card>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div div class=\"col-xl-6\">\n\t\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.PROPOSALS_CONTENT' | translate }}\n\t\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t\t<nb-card-body>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"proposalContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t\t</nb-card>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left card-footer\">\n\t\t<button\n\t\t\t[disabled]=\"form.invalid\"\n\t\t\t(click)=\"proposalForm.ngSubmit.emit()\"\n\t\t\tclass=\"register-btn\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.REGISTER_PROPOSALS' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";.register-btn{margin:20px}.upload-btn{margin-top:20px}.wrapper-top{display:grid;grid-template-columns:1fr 1fr 1fr;grid-gap:3em;text-align:center}.wrapper-top .prop-card{align-items:center;padding:2em}@media(max-width:1120px){.wrapper-top{grid-template-columns:1fr 1fr}}@media(max-width:600px){.wrapper-top{display:block}}.wrapper-bottom{display:grid;grid-template-columns:1fr 1fr;grid-gap:2em;text-align:left;height:fit-content}.wrapper-bottom h6{text-align:center;padding:1em}.wrapper-bottom p{padding:0 2em}@media(max-width:900px){.wrapper-bottom{display:block}}[dir=rtl] :host ::ng-deep .card-header{gap:2rem}[dir=rtl] :host ::ng-deep .card-header ngx-back-navigation button{margin:3px 0 0!important}:host .card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius);border:unset}:host .card .card-header{flex:0 1 auto;border-bottom:unset}:host .card .card-body{flex:1 1 auto;overflow:overlay;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 1.5rem);background-color:var(--gauzy-card-2)}:host .card .card-footer{border:unset;flex:0 1 auto}:host .card,:host .card-body{background:var(--gauzy-card-2)}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i6.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i5.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i5.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i5.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i5.NbDatepickerComponent, selector: "nb-datepicker", inputs: ["date"], outputs: ["dateChange"] }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i6.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "component", type: i6.HeaderTitleComponent, selector: "ngx-header-title", inputs: ["allowEmployee", "allowOrganization"] }, { kind: "component", type: i6.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i6.ProposalTemplateSelectComponent, selector: "ngx-proposal-template-select", inputs: ["disabled", "multiple", "employeeId"], outputs: ["selectedChange"] }, { kind: "component", type: i6.ContactSelectComponent, selector: "ga-contact-select", inputs: ["disabled", "placeholder", "clearable", "addTag", "searchable"], outputs: ["onChanged"] }, { kind: "component", type: i6.EmployeeSelectorComponent, selector: "ga-employee-selector", inputs: ["clearable", "addTag", "skipGlobalChange", "disabled", "placeholder", "defaultSelected", "showAllEmployeesOption", "dropdownClass", "selectedDateRange", "selectedEmployee"], outputs: ["selectionChanged"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ProposalRegisterComponent = ProposalRegisterComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        UntypedFormBuilder,
        Store,
        Router,
        NbDateService,
        ProposalsService,
        ToastrService,
        ChangeDetectorRef,
        OrganizationSettingService,
        ErrorHandlingService])
], ProposalRegisterComponent);
export { ProposalRegisterComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalRegisterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-proposal-register', standalone: false, template: "<nb-card class=\"card\">\n\t<nb-card-header class=\"d-flex card-header\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h4>\n\t\t\t<ngx-header-title>\n\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.REGISTER_PROPOSALS' | translate }}\n\t\t\t</ngx-header-title>\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body class=\"card-body\">\n\t\t<form [formGroup]=\"form\" #proposalForm=\"ngForm\" (ngSubmit)=\"registerProposal()\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.AUTHOR' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ga-employee-selector\n\t\t\t\t\t\t\t\tid=\"authorInput\"\n\t\t\t\t\t\t\t\tclass=\"employees\"\n\t\t\t\t\t\t\t\t[skipGlobalChange]=\"true\"\n\t\t\t\t\t\t\t\t[defaultSelected]=\"true\"\n\t\t\t\t\t\t\t\t(selectionChanged)=\"selectionEmployee($event)\"\n\t\t\t\t\t\t\t></ga-employee-selector>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\"> {{ 'PROPOSALS_PAGE.REGISTER.TEMPLATE' | translate }}</label>\n\t\t\t\t\t\t\t<ngx-proposal-template-select\n\t\t\t\t\t\t\t\t(selectedChange)=\"onProposalTemplateChange($event)\"\n\t\t\t\t\t\t\t\t[ngModelOptions]=\"{ standalone: true }\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"proposalTemplateId\"\n\t\t\t\t\t\t\t\t[employeeId]=\"selectedEmployee?.id\"\n\t\t\t\t\t\t\t></ngx-proposal-template-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'POP_UPS.CONTACT' | translate }}</label>\n\t\t\t\t\t\t\t<ga-contact-select\n\t\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t(onChanged)=\"selectOrganizationContact($event)\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.CONTACT' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</ga-contact-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-xl-6\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'PROPOSALS_PAGE.REGISTER.JOB_POST_URL' | translate }} </label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROPOSALS_PAGE.REGISTER.JOB_POST_URL' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"jobPostUrl\"\n\t\t\t\t\t\t\t\tautocomplete=\"on\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">{{ 'PROPOSALS_PAGE.REGISTER.PROPOSAL_DATE' | translate }} </label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tformControlName=\"valueDate\"\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROPOSALS_PAGE.REGISTER.PROPOSAL_DATE' | translate\"\n\t\t\t\t\t\t\t\t[nbDatepicker]=\"valueDatePicker\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t<nb-datepicker [min]=\"minDate\" #valueDatePicker></nb-datepicker>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-3\">\n\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-xl-6\">\n\t\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.JOB_POST_CONTENT' | translate }}\n\t\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t\t<nb-card-body>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"jobPostContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t\t</nb-card>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div div class=\"col-xl-6\">\n\t\t\t\t\t\t<nb-card>\n\t\t\t\t\t\t\t<nb-card-header>\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.PROPOSALS_CONTENT' | translate }}\n\t\t\t\t\t\t\t</nb-card-header>\n\t\t\t\t\t\t\t<nb-card-body>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"proposalContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</nb-card-body>\n\t\t\t\t\t\t</nb-card>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left card-footer\">\n\t\t<button\n\t\t\t[disabled]=\"form.invalid\"\n\t\t\t(click)=\"proposalForm.ngSubmit.emit()\"\n\t\t\tclass=\"register-btn\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'PROPOSALS_PAGE.REGISTER.REGISTER_PROPOSALS' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";.register-btn{margin:20px}.upload-btn{margin-top:20px}.wrapper-top{display:grid;grid-template-columns:1fr 1fr 1fr;grid-gap:3em;text-align:center}.wrapper-top .prop-card{align-items:center;padding:2em}@media(max-width:1120px){.wrapper-top{grid-template-columns:1fr 1fr}}@media(max-width:600px){.wrapper-top{display:block}}.wrapper-bottom{display:grid;grid-template-columns:1fr 1fr;grid-gap:2em;text-align:left;height:fit-content}.wrapper-bottom h6{text-align:center;padding:1em}.wrapper-bottom p{padding:0 2em}@media(max-width:900px){.wrapper-bottom{display:block}}[dir=rtl] :host ::ng-deep .card-header{gap:2rem}[dir=rtl] :host ::ng-deep .card-header ngx-back-navigation button{margin:3px 0 0!important}:host .card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius);border:unset}:host .card .card-header{flex:0 1 auto;border-bottom:unset}:host .card .card-body{flex:1 1 auto;overflow:overlay;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 1.5rem);background-color:var(--gauzy-card-2)}:host .card .card-footer{border:unset;flex:0 1 auto}:host .card,:host .card-body{background:var(--gauzy-card-2)}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.UntypedFormBuilder }, { type: i3.Store }, { type: i4.Router }, { type: i5.NbDateService }, { type: i3.ProposalsService }, { type: i3.ToastrService }, { type: i0.ChangeDetectorRef }, { type: i3.OrganizationSettingService }, { type: i3.ErrorHandlingService }] });
//# sourceMappingURL=proposal-register.component.js.map