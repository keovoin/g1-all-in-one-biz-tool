import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { NbDialogRef, NbStepperComponent } from '@nebular/theme';
import { filter, tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RolesEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { CandidatesService, ErrorHandlingService, RoleService, Store } from '@gauzy/ui-core/core';
import { BasicInfoFormComponent } from '../../user/forms';
import { CandidateCvComponent } from '../candidate-cv/candidate-cv.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "../../user/forms/basic-info/basic-info-form.component";
import * as i4 from "../candidate-cv/candidate-cv.component";
import * as i5 from "@ngx-translate/core";
let CandidateMutationComponent = class CandidateMutationComponent {
    constructor(dialogRef, roleService, store, candidatesService, errorHandler) {
        this.dialogRef = dialogRef;
        this.roleService = roleService;
        this.store = store;
        this.candidatesService = candidatesService;
        this.errorHandler = errorHandler;
        this.candidates = [];
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
    }
    async ngAfterViewInit() {
        this.form = this.userBasicInfo.form;
        this.formCV = this.candidateCv.form;
        const { tenantId } = this.store.user;
        this.role = await firstValueFrom(this.roleService.getRoleByOptions({
            name: RolesEnum.CANDIDATE,
            tenantId
        }));
    }
    closeDialog(candidate = null) {
        this.dialogRef.close(candidate);
    }
    addCandidate() {
        this.form = this.userBasicInfo.form;
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const { firstName, lastName, email, username, password, tags, imageUrl } = this.form.getRawValue();
        const { appliedDate = null, rejectDate = null } = this.form.getRawValue();
        const sourceName = this.form.get('source').value || null;
        const user = {
            username,
            firstName,
            lastName,
            email,
            imageUrl,
            tenant: null,
            role: this.role,
            tags
        };
        let source = null;
        if (sourceName !== null) {
            source = {
                name: sourceName,
                tenantId,
                organizationId
            };
        }
        const cvUrl = this.formCV.get('cvUrl').value || null;
        let documents = null;
        if (cvUrl !== null) {
            documents = [
                {
                    name: 'CV',
                    documentUrl: cvUrl,
                    tenantId,
                    organizationId
                }
            ];
        }
        const candidate = {
            user,
            cvUrl,
            documents,
            password,
            organization: this.organization,
            appliedDate,
            source,
            rejectDate,
            tags,
            tenantId,
            organizationId
        };
        if (this.form.valid)
            this.candidates.push(candidate);
        this.candidateCv.loadFormData();
        this.formCV = this.candidateCv.form;
        this.form.reset();
        this.stepper.reset();
    }
    async add() {
        this.addCandidate();
        try {
            const candidates = await firstValueFrom(this.candidatesService.createBulk(this.candidates));
            this.closeDialog(candidates);
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
    }
    /**
     *  Go to another the step without to saving data form
     */
    gotoStep(step) {
        for (let i = 1; i < step; i++) {
            this.stepper.next(); // change step
        }
    }
    /**
     * Removed one candidate in the array of candidates.
     * @param tag
     */
    onCandidateRemove(tag) {
        this.candidates = this.candidates.filter((t) => t.user.email !== tag.text);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMutationComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.RoleService }, { token: i2.Store }, { token: i2.CandidatesService }, { token: i2.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateMutationComponent, isStandalone: false, selector: "ga-candidate-mutation", viewQueries: [{ propertyName: "userBasicInfo", first: true, predicate: ["userBasicInfo"], descendants: true }, { propertyName: "candidateCv", first: true, predicate: ["candidateCv"], descendants: true }, { propertyName: "stepper", first: true, predicate: ["stepper"], descendants: true }], ngImport: i0, template: "<nb-card>\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\">\n      <i class=\"fas fa-times\" (click)=\"closeDialog()\"></i>\n    </span>\n    <h5 class=\"title\">\n      {{ 'CANDIDATES_PAGE.ADD_CANDIDATE' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <nb-stepper [disableStepNavigation]=\"true\" #stepper>\n      <nb-step [label]=\"step1\">\n        <ng-template #step1>\n          {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.STEP_1' | translate }}\n        </ng-template>\n\n        @if (candidates.length > 0) {\n          <div class=\"row\">\n            <div class=\"col-auto mt-2 mb-2\">\n              <nb-tag-list (tagRemove)=\"onCandidateRemove($event)\">\n                @for (candidate of candidates; track candidate) {\n                  <nb-tag\n                    removable\n                    [text]=\"candidate?.user?.email\"\n                  ></nb-tag>\n                }\n              </nb-tag-list>\n            </div>\n          </div>\n        }\n\n        <ga-user-basic-info-form\n          #userBasicInfo\n          [isShowRole]=\"false\"\n          [isCandidate]=\"true\"\n        ></ga-user-basic-info-form>\n\n        <div class=\"text-left\">\n          @if (candidates.length) {\n            <button\n              class=\"mr-2\"\n              status=\"basic\"\n              outline\n              (click)=\"gotoStep(3)\"\n              nbButton\n              >\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n          }\n          <button\n            status=\"basic\"\n            [disabled]=\"userBasicInfo.form.invalid\"\n            nbButton\n            class=\"green\"\n            size=\"small\"\n            outline\n            nbStepperNext\n            >\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step2\">\n        <ng-template #step2>\n          {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.STEP_2' | translate }}\n        </ng-template>\n        <div class=\"file-uploader\">\n          <div class=\"label\">\n            {{ 'FORM.LABELS.CV_URL' | translate }}\n          </div>\n          <ga-candidate-cv #candidateCv></ga-candidate-cv>\n        </div>\n        <div class=\"text-left\">\n          <button status=\"basic\" class=\"gray\" size=\"small\" nbButton outline nbStepperPrevious>\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.PREVIOUS' | translate }}\n          </button>\n          <button nbButton outline size=\"small\" class=\"green mr-3 ml-3\" nbStepperNext>\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step3\">\n        <ng-template #step3>\n          {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.STEP_3' | translate }}\n        </ng-template>\n        <div class=\"text-left\">\n          <button nbButton outline class=\"green\" size=\"small\" (click)=\"addCandidate()\">\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.ADD_ANOTHER_CANDIDATE' | translate }}\n          </button>\n          <button status=\"success\" size=\"small\" (click)=\"add()\" class=\"mr-3 ml-3\" nbButton>\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.FINISHED_ADDING' | translate }}\n          </button>\n        </div>\n      </nb-step>\n    </nb-stepper>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card{background-color:var(--gauzy-card-1);width:645px}:host nb-card nb-card-header nb-icon.close{cursor:pointer}:host nb-card nb-tag-list nb-tag::ng-deep{text-transform:initial}:host ::ng-deep div.step-content{padding:20px 0}:host .button-container{display:flex;justify-content:flex-start}[dir=ltr] :host .button-container button{margin:0 0 0 1rem}[dir=rtl] :host .button-container button{margin-left:0 1rem 0 0}.label{margin:0 0 8px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbStepperComponent, selector: "nb-stepper", inputs: ["selectedIndex", "disableStepNavigation", "selected", "orientation", "linear"], outputs: ["stepChange"] }, { kind: "component", type: i1.NbStepComponent, selector: "nb-step", inputs: ["stepControl", "label", "hidden", "completed"] }, { kind: "directive", type: i1.NbStepperNextDirective, selector: "button[nbStepperNext]", inputs: ["type"] }, { kind: "directive", type: i1.NbStepperPreviousDirective, selector: "button[nbStepperPrevious]", inputs: ["type"] }, { kind: "component", type: i1.NbTagComponent, selector: "nb-tag", inputs: ["text", "selected", "removable", "appearance", "status", "size", "role"], outputs: ["remove", "selectedChange"], exportAs: ["nbTag"] }, { kind: "component", type: i1.NbTagListComponent, selector: "nb-tag-list", inputs: ["size", "tabIndex", "role", "multiple"], outputs: ["tagRemove"], exportAs: ["nbTagList"] }, { kind: "component", type: i3.BasicInfoFormComponent, selector: "ga-user-basic-info-form", inputs: ["selectedTags", "isCandidate", "isEmployee", "isShowRole"] }, { kind: "component", type: i4.CandidateCvComponent, selector: "ga-candidate-cv", inputs: ["documentUrl", "isDocument"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
CandidateMutationComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        RoleService,
        Store,
        CandidatesService,
        ErrorHandlingService])
], CandidateMutationComponent);
export { CandidateMutationComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateMutationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-mutation', standalone: false, template: "<nb-card>\n  <nb-card-header class=\"d-flex flex-column\">\n    <span class=\"cancel\">\n      <i class=\"fas fa-times\" (click)=\"closeDialog()\"></i>\n    </span>\n    <h5 class=\"title\">\n      {{ 'CANDIDATES_PAGE.ADD_CANDIDATE' | translate }}\n    </h5>\n  </nb-card-header>\n  <nb-card-body>\n    <nb-stepper [disableStepNavigation]=\"true\" #stepper>\n      <nb-step [label]=\"step1\">\n        <ng-template #step1>\n          {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.STEP_1' | translate }}\n        </ng-template>\n\n        @if (candidates.length > 0) {\n          <div class=\"row\">\n            <div class=\"col-auto mt-2 mb-2\">\n              <nb-tag-list (tagRemove)=\"onCandidateRemove($event)\">\n                @for (candidate of candidates; track candidate) {\n                  <nb-tag\n                    removable\n                    [text]=\"candidate?.user?.email\"\n                  ></nb-tag>\n                }\n              </nb-tag-list>\n            </div>\n          </div>\n        }\n\n        <ga-user-basic-info-form\n          #userBasicInfo\n          [isShowRole]=\"false\"\n          [isCandidate]=\"true\"\n        ></ga-user-basic-info-form>\n\n        <div class=\"text-left\">\n          @if (candidates.length) {\n            <button\n              class=\"mr-2\"\n              status=\"basic\"\n              outline\n              (click)=\"gotoStep(3)\"\n              nbButton\n              >\n              {{ 'BUTTONS.CANCEL' | translate }}\n            </button>\n          }\n          <button\n            status=\"basic\"\n            [disabled]=\"userBasicInfo.form.invalid\"\n            nbButton\n            class=\"green\"\n            size=\"small\"\n            outline\n            nbStepperNext\n            >\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step2\">\n        <ng-template #step2>\n          {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.STEP_2' | translate }}\n        </ng-template>\n        <div class=\"file-uploader\">\n          <div class=\"label\">\n            {{ 'FORM.LABELS.CV_URL' | translate }}\n          </div>\n          <ga-candidate-cv #candidateCv></ga-candidate-cv>\n        </div>\n        <div class=\"text-left\">\n          <button status=\"basic\" class=\"gray\" size=\"small\" nbButton outline nbStepperPrevious>\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.PREVIOUS' | translate }}\n          </button>\n          <button nbButton outline size=\"small\" class=\"green mr-3 ml-3\" nbStepperNext>\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.NEXT' | translate }}\n          </button>\n        </div>\n      </nb-step>\n      <nb-step [label]=\"step3\">\n        <ng-template #step3>\n          {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.STEP_3' | translate }}\n        </ng-template>\n        <div class=\"text-left\">\n          <button nbButton outline class=\"green\" size=\"small\" (click)=\"addCandidate()\">\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.ADD_ANOTHER_CANDIDATE' | translate }}\n          </button>\n          <button status=\"success\" size=\"small\" (click)=\"add()\" class=\"mr-3 ml-3\" nbButton>\n            {{ 'CANDIDATES_PAGE.ADD_CANDIDATES.FINISHED_ADDING' | translate }}\n          </button>\n        </div>\n      </nb-step>\n    </nb-stepper>\n  </nb-card-body>\n</nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-1)}:host nb-card{background-color:var(--gauzy-card-1);width:645px}:host nb-card nb-card-header nb-icon.close{cursor:pointer}:host nb-card nb-tag-list nb-tag::ng-deep{text-transform:initial}:host ::ng-deep div.step-content{padding:20px 0}:host .button-container{display:flex;justify-content:flex-start}[dir=ltr] :host .button-container button{margin:0 0 0 1rem}[dir=rtl] :host .button-container button{margin-left:0 1rem 0 0}.label{margin:0 0 8px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.RoleService }, { type: i2.Store }, { type: i2.CandidatesService }, { type: i2.ErrorHandlingService }], propDecorators: { userBasicInfo: [{
                type: ViewChild,
                args: ['userBasicInfo']
            }], candidateCv: [{
                type: ViewChild,
                args: ['candidateCv']
            }], stepper: [{
                type: ViewChild,
                args: ['stepper']
            }] } });
//# sourceMappingURL=candidate-mutation.component.js.map