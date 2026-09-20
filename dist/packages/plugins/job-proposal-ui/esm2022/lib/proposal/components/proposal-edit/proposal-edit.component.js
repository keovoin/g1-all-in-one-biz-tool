var ProposalEditComponent_1;
import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { ErrorHandlingService, OrganizationSettingService, ProposalsService, ToastrService, UrlPatternValidator } from '@gauzy/ui-core/core';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@angular/forms";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@nebular/theme";
let ProposalEditComponent = class ProposalEditComponent extends TranslationBaseComponent {
    static { ProposalEditComponent_1 = this; }
    static buildForm(fb, self) {
        return fb.group({
            jobPostUrl: [],
            valueDate: [self._organizationSettingService.getDateFromOrganizationSettings(), Validators.required],
            jobPostContent: [null, Validators.required],
            proposalContent: [null, Validators.required],
            tags: [],
            organizationContact: [],
            employee: []
        }, {
            validators: [UrlPatternValidator.websiteUrlValidator('jobPostUrl')]
        });
    }
    constructor(translateService, _route, _fb, _router, _toastrService, _proposalsService, _organizationSettingService, _cdRef, _errorHandlingService) {
        super(translateService);
        this.translateService = translateService;
        this._route = _route;
        this._fb = _fb;
        this._router = _router;
        this._toastrService = _toastrService;
        this._proposalsService = _proposalsService;
        this._organizationSettingService = _organizationSettingService;
        this._cdRef = _cdRef;
        this._errorHandlingService = _errorHandlingService;
        /*
         * Proposal Mutation Form
         */
        this.form = ProposalEditComponent_1.buildForm(this._fb, this);
    }
    ngOnInit() {
        this._route.data
            .pipe(debounceTime(100), distinctUntilChange(), filter((data) => !!data && !!data.proposal), tap(({ proposal }) => this.selectProposal(proposal)), tap(() => this._patchFormValue()), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this._cdRef.detectChanges();
    }
    /**
     * Selects the proposal and sets the form values.
     *
     * @param proposal
     */
    selectProposal(proposal) {
        try {
            this.proposal = Object.assign({}, proposal, {
                jobPostLink: proposal.jobPostUrl ? proposal.jobPostUrl : '',
                jobTitle: proposal.jobPostContent
                    .toString()
                    .replace(/<[^>]*(>|$)|&nbsp;/g, '')
                    .split(/[\s,\n]+/)
                    .slice(0, 3)
                    .join(' '),
                author: proposal.employee
            });
        }
        catch (error) {
            console.log('Error while selecting proposal', error);
            this._router.navigate(['/pages/sales/proposals']);
        }
    }
    /**
     * Patches the form with values from the current proposal, if available.
     *
     * This method populates the form fields with data from the existing proposal,
     * which is useful for initializing or editing a form.
     */
    _patchFormValue() {
        if (!this.proposal) {
            console.warn('No proposal found to patch the form.');
            return;
        }
        const { jobPostUrl, valueDate, jobPostContent, proposalContent, organizationContact, tags = [], employee } = this.proposal;
        this.form.patchValue({
            jobPostUrl,
            valueDate,
            jobPostContent,
            proposalContent,
            organizationContact,
            tags,
            employee
        });
        this.form.updateValueAndValidity(); // Ensure the form's state is consistent
    }
    /**
     * Edits an existing proposal if the form is valid and a proposal is specified.
     *
     * This function updates a proposal based on the form's input values. It validates the form,
     * extracts necessary information, and uses the `proposalsService` to perform the update.
     * Success or error messages are displayed based on the outcome.
     *
     * @returns A promise that resolves upon successful editing or rejects with an error.
     */
    async editProposal() {
        // Check if the form is valid and the proposal exists
        if (!this.form.valid || !this.proposal) {
            return; // Return early if preconditions are not met
        }
        try {
            const { organizationId, tenantId } = this.proposal; // Extract the tenant ID & organization ID from the existing proposal
            // Get the necessary data from the form
            const { jobPostContent, jobPostUrl, proposalContent, tags, organizationContact } = this.form.value;
            // Update the proposal with new values
            await this._proposalsService.update(this.proposal.id, {
                tenantId,
                organizationId,
                jobPostContent,
                jobPostUrl,
                proposalContent,
                tags,
                organizationContact
            });
            // Show success message upon successful update
            this._toastrService.success('NOTES.PROPOSALS.EDIT_PROPOSAL');
            // Navigate to the proposals page after editing
            this._router.navigate(['/pages/sales/proposals']);
        }
        catch (error) {
            console.log('Error while editing proposal', error);
            // Handle errors that occur during the update
            this._errorHandlingService.handleError(error);
        }
    }
    /**
     * Updates the 'tags' field in the form based on the selected tags.
     *
     * @param tags An array of selected tags to be set in the form.
     */
    selectedTagsEvent(tags) {
        this.form.get('tags').setValue(tags);
        this.form.get('tags').updateValueAndValidity();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalEditComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i3.UntypedFormBuilder }, { token: i2.Router }, { token: i4.ToastrService }, { token: i4.ProposalsService }, { token: i4.OrganizationSettingService }, { token: i0.ChangeDetectorRef }, { token: i4.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProposalEditComponent, isStandalone: false, selector: "ngx-proposal-edit", usesInheritance: true, ngImport: i0, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h4>\n\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.EDIT_PROPOSAL' | translate }}\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.JOB_POST_URL' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROPOSALS_PAGE.EDIT_PROPOSAL.PLACEHOLDER.JOB_POST_URL' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"jobPostUrl\"\n\t\t\t\t\t\t\t\tautocomplete=\"on\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'POP_UPS.CONTACT' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ga-contact-select\n\t\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.CONTACT' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t></ga-contact-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row text-editors\">\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.JOB_POST_CONTENT' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"jobPostContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.PROPOSAL_CONTENT' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"proposalContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button\n\t\t\t[disabled]=\"form.invalid\"\n\t\t\t(click)=\"editProposal()\"\n\t\t\tclass=\"edit-btn\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.EDIT_PROPOSAL_BUTTON' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";.text-editors{padding:0 15px}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:overlay;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.5rem)}:host nb-card nb-card-footer{flex:0 1 auto}:host nb-card,:host nb-card-body,:host nb-card-footer{background-color:var(--gauzy-card-2)}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i5.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "component", type: i6.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i6.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i6.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i6.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i6.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i6.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i5.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "component", type: i5.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i5.ContactSelectComponent, selector: "ga-contact-select", inputs: ["disabled", "placeholder", "clearable", "addTag", "searchable"], outputs: ["onChanged"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
ProposalEditComponent = ProposalEditComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        UntypedFormBuilder,
        Router,
        ToastrService,
        ProposalsService,
        OrganizationSettingService,
        ChangeDetectorRef,
        ErrorHandlingService])
], ProposalEditComponent);
export { ProposalEditComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalEditComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-proposal-edit', standalone: false, template: "<nb-card class=\"main\">\n\t<nb-card-header class=\"d-flex\">\n\t\t<ngx-back-navigation></ngx-back-navigation>\n\t\t<h4>\n\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.EDIT_PROPOSAL' | translate }}\n\t\t</h4>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<form [formGroup]=\"form\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col-sm-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.JOB_POST_URL' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'PROPOSALS_PAGE.EDIT_PROPOSAL.PLACEHOLDER.JOB_POST_URL' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"jobPostUrl\"\n\t\t\t\t\t\t\t\tautocomplete=\"on\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t{{ 'POP_UPS.CONTACT' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ga-contact-select\n\t\t\t\t\t\t\t\t[addTag]=\"true\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'POP_UPS.CONTACT' | translate\"\n\t\t\t\t\t\t\t\tformControlName=\"organizationContact\"\n\t\t\t\t\t\t\t></ga-contact-select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-sm-4\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t\t\t\t[selectedTags]=\"form.get('tags').value\"\n\t\t\t\t\t\t\t\t(selectedTagsEvent)=\"selectedTagsEvent($event)\"\n\t\t\t\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t\t\t></ga-tags-color-input>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"row text-editors\">\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.JOB_POST_CONTENT' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"jobPostContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t<label class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.PROPOSAL_CONTENT' | translate }}\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t<ga-rich-text-editor\n\t\t\t\t\t\t\t\t\tformControlName=\"proposalContent\"\n\t\t\t\t\t\t\t\t\tpreset=\"standard\"\n\t\t\t\t\t\t\t\t\toutputFormat=\"html\"\n\t\t\t\t\t\t\t\t\tminHeight=\"320px\"\n\t\t\t\t\t\t\t\t></ga-rich-text-editor>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer class=\"text-left\">\n\t\t<button\n\t\t\t[disabled]=\"form.invalid\"\n\t\t\t(click)=\"editProposal()\"\n\t\t\tclass=\"edit-btn\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'PROPOSALS_PAGE.EDIT_PROPOSAL.EDIT_PROPOSAL_BUTTON' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";.text-editors{padding:0 15px}:host nb-card{display:flex;flex-flow:column;height:100%;border-radius:var(--border-radius)}:host nb-card nb-card-header{flex:0 1 auto}:host nb-card nb-card-body{flex:1 1 auto;overflow:overlay;height:calc(100vh - calc(var(--header-height) + var(--footer-height)) - 13.125rem + 3.5rem)}:host nb-card nb-card-footer{flex:0 1 auto}:host nb-card,:host nb-card-body,:host nb-card-footer{background-color:var(--gauzy-card-2)}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:42px!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i3.UntypedFormBuilder }, { type: i2.Router }, { type: i4.ToastrService }, { type: i4.ProposalsService }, { type: i4.OrganizationSettingService }, { type: i0.ChangeDetectorRef }, { type: i4.ErrorHandlingService }] });
//# sourceMappingURL=proposal-edit.component.js.map