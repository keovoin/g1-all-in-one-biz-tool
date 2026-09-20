var ApprovalPolicyMutationComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap } from 'rxjs/operators';
import { Store } from '@gauzy/ui-core/core';
import { ApprovalPolicyService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../forms/helpers';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@angular/forms";
import * as i4 from "@ngx-translate/core";
let ApprovalPolicyMutationComponent = class ApprovalPolicyMutationComponent extends TranslationBaseComponent {
    static { ApprovalPolicyMutationComponent_1 = this; }
    get approvalPolicy() {
        return this._approvalPolicy;
    }
    set approvalPolicy(value) {
        this._approvalPolicy = value;
        this.patchForm();
    }
    static buildForm(fb) {
        return fb.group({
            name: [null, Validators.required],
            description: []
        });
    }
    constructor(dialogRef, approvalPolicyService, fb, translationService, store, toastrService) {
        super(translationService);
        this.dialogRef = dialogRef;
        this.approvalPolicyService = approvalPolicyService;
        this.fb = fb;
        this.translationService = translationService;
        this.store = store;
        this.toastrService = toastrService;
        this.FormHelpers = FormHelpers;
        /*
         * Approval Policy Mutation Form
         */
        this.form = ApprovalPolicyMutationComponent_1.buildForm(this.fb);
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
    }
    patchForm() {
        this.form.setValue({
            name: this.approvalPolicy ? this.approvalPolicy.name : '',
            description: this.approvalPolicy ? this.approvalPolicy.description : ''
        });
        this.form.updateValueAndValidity();
    }
    closeDialog(approvalPolicy) {
        this.onReset();
        this.dialogRef.close(approvalPolicy);
    }
    async onSubmit() {
        if (this.form.invalid || !this.formDirective.submitted || !this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { name } = this.form.getRawValue();
        const { items: existingPolicies } = await this.approvalPolicyService.getAll([], {
            name,
            organizationId,
            tenantId
        });
        // For a new policy, any existing policy with the same name is a duplicate
        // For an existing policy, only other policies with different IDs are duplicates
        const isDuplicate = this.approvalPolicy
            ? existingPolicies.some((policy) => policy.id !== this.approvalPolicy.id)
            : existingPolicies.length > 0;
        if (isDuplicate) {
            this.toastrService.danger(this.getTranslation('TOASTR.MESSAGE.APPROVAL_POLICY_ALREADY_EXISTS', { name }));
            return;
        }
        const approvalPolicy = {
            tenantId,
            organizationId,
            ...this.form.getRawValue(),
            ...(this.approvalPolicy ? { id: this.approvalPolicy.id } : {})
        };
        try {
            const result = await this.approvalPolicyService.save(approvalPolicy);
            this.closeDialog(result);
        }
        catch (error) {
            console.error('Error while creating/updating approval policy', error);
            this.toastrService.danger(error);
        }
    }
    /**
     * Reset approval policy mutation form after save
     */
    onReset() {
        this.formDirective.reset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.ApprovalPolicyService }, { token: i3.UntypedFormBuilder }, { token: i4.TranslateService }, { token: i2.Store }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ApprovalPolicyMutationComponent, isStandalone: false, selector: "ngx-approval-policy-mutation", inputs: { approvalPolicy: "approvalPolicy" }, viewQueries: [{ propertyName: "formDirective", first: true, predicate: ["formDirective"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card>\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(approvalPolicy\n\t\t\t\t\t? 'APPROVAL_POLICY_PAGE.EDIT_APPROVAL_POLICY'\n\t\t\t\t\t: 'APPROVAL_POLICY_PAGE.ADD_APPROVAL_POLICY'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\" #formDirective=\"ngForm\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"name\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_NAME' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_NAME' | translate\"\n\t\t\t\t\t\t[class.status-danger]=\"FormHelpers.isInvalidControl(form, 'name')\"\n\t\t\t\t\t\t[class.status-success]=\"FormHelpers.isValidControl(form, 'name')\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"Description\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_DESCRIPTION' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\trows=\"4\"\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"closeDialog()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t[disabled]=\"form.invalid || formDirective.submitted\"\n\t\t\t(click)=\"formDirective.onSubmit()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.in-valid{border:1px solid #ff3d71;border-radius:.25rem}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
ApprovalPolicyMutationComponent = ApprovalPolicyMutationComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        ApprovalPolicyService,
        UntypedFormBuilder,
        TranslateService,
        Store,
        ToastrService])
], ApprovalPolicyMutationComponent);
export { ApprovalPolicyMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-approval-policy-mutation', standalone: false, template: "<nb-card>\n\t<nb-card-header class=\"d-flex flex-column\">\n\t\t<span class=\"cancel\"><i class=\"fas fa-times\" (click)=\"closeDialog()\"></i></span>\n\t\t<h5 class=\"title\">\n\t\t\t{{\n\t\t\t\t(approvalPolicy\n\t\t\t\t\t? 'APPROVAL_POLICY_PAGE.EDIT_APPROVAL_POLICY'\n\t\t\t\t\t: 'APPROVAL_POLICY_PAGE.ADD_APPROVAL_POLICY'\n\t\t\t\t) | translate\n\t\t\t}}\n\t\t</h5>\n\t</nb-card-header>\n\t<nb-card-body class=\"body\">\n\t\t<form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\" #formDirective=\"ngForm\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"name\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_NAME' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tformControlName=\"name\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_NAME' | translate\"\n\t\t\t\t\t\t[class.status-danger]=\"FormHelpers.isInvalidControl(form, 'name')\"\n\t\t\t\t\t\t[class.status-success]=\"FormHelpers.isValidControl(form, 'name')\"\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"col-sm-12 mb-3\">\n\t\t\t\t\t<label for=\"Description\" class=\"label\">\n\t\t\t\t\t\t{{ 'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_DESCRIPTION' | translate }}\n\t\t\t\t\t</label>\n\t\t\t\t\t<textarea\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tformControlName=\"description\"\n\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\trows=\"4\"\n\t\t\t\t\t\t[placeholder]=\"'APPROVAL_POLICY_PAGE.APPROVAL_POLICY_DESCRIPTION' | translate\"\n\t\t\t\t\t></textarea>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</nb-card-body>\n\t<nb-card-footer>\n\t\t<button (click)=\"closeDialog()\" status=\"basic\" outline class=\"mr-3\" nbButton>\n\t\t\t{{ 'BUTTONS.CANCEL' | translate }}\n\t\t</button>\n\t\t<button\n\t\t\t[disabled]=\"form.invalid || formDirective.submitted\"\n\t\t\t(click)=\"formDirective.onSubmit()\"\n\t\t\tstatus=\"success\"\n\t\t\tnbButton\n\t\t>\n\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t</button>\n\t</nb-card-footer>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}.in-valid{border:1px solid #ff3d71;border-radius:.25rem}:host nb-card{background-color:var(--gauzy-card-1)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.ApprovalPolicyService }, { type: i3.UntypedFormBuilder }, { type: i4.TranslateService }, { type: i2.Store }, { type: i2.ToastrService }], propDecorators: { formDirective: [{
                type: ViewChild,
                args: ['formDirective']
            }], approvalPolicy: [{
                type: Input
            }] } });
//# sourceMappingURL=approval-policy-mutation.component.js.map