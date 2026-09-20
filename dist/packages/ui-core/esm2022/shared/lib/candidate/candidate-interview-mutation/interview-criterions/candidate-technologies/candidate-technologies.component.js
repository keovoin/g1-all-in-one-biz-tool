import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { takeUntil } from 'rxjs/operators';
import { CandidateTechnologiesService, ToastrService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import { CommunicationService } from '../../communication.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@ngx-translate/core";
import * as i4 from "../../communication.service";
import * as i5 from "@nebular/theme";
export class CandidateTechnologiesComponent extends TranslationBaseComponent {
    constructor(fb, toastrService, translateService, candidateTechnologiesService, store, communicationService) {
        super(translateService);
        this.fb = fb;
        this.toastrService = toastrService;
        this.translateService = translateService;
        this.candidateTechnologiesService = candidateTechnologiesService;
        this.store = store;
        this.communicationService = communicationService;
        this._ngDestroy$ = new Subject();
        this.technologyNames = [];
        this.editId = null;
    }
    ngOnInit() {
        this.store.selectedOrganization$.pipe(takeUntil(this._ngDestroy$)).subscribe((organization) => {
            if (organization) {
                this.organization = organization;
                this._initializeForm();
                this.loadTechnologies();
            }
        });
    }
    async _initializeForm() {
        this.form = new UntypedFormGroup({
            technologies: this.fb.array([])
        });
        const technologyForm = this.form.controls.technologies;
        technologyForm.push(this.fb.group({
            name: ['', Validators.required]
        }));
        this.form.valueChanges.subscribe((item) => {
            this.existedTechNames = [];
            const enteredName = item.technologies[0].name;
            this.technologiesList.forEach((el) => {
                if (enteredName !== '' && el.name.toLocaleLowerCase().includes(enteredName)) {
                    this.existedTechNames.push(el.name);
                }
            });
        });
    }
    async loadTechnologies() {
        const { id: organizationId, tenantId } = this.organization;
        const res = await this.candidateTechnologiesService.getAll({
            organizationId,
            tenantId
        });
        if (res) {
            this.technologiesList = res.items.filter((item) => !item.interviewId);
            this.technologyNames = [];
            this.technologiesList.forEach((tech) => {
                this.technologyNames.push(tech.name.toLocaleLowerCase());
            });
        }
    }
    async save() {
        const { id: organizationId, tenantId } = this.organization;
        const technologiesForm = this.technologies;
        const formValue = { ...technologiesForm.value[0] };
        const targetValue = Object.assign(formValue, {
            organizationId,
            tenantId
        });
        if (this.editId !== null) {
            this.update(targetValue);
        }
        else {
            this.create(targetValue);
        }
        technologiesForm.reset();
    }
    async update(formValue) {
        if (!this.technologyNames.includes(formValue.name.toLocaleLowerCase())) {
            try {
                await this.candidateTechnologiesService.update(this.editId, {
                    ...formValue
                });
                this.editId = null;
                this.toastrService.success('TOASTR.MESSAGE.TECHNOLOGY_STACK_UPDATED', {
                    name: formValue.name
                });
                this.loadTechnologies();
                this.communicationService.addTechnology(formValue);
            }
            catch (error) {
                this.toastrError(error);
            }
        }
        else {
            this.toastrService.danger(this.getTranslation('CANDIDATES_PAGE.CRITERIONS.TOASTR_ALREADY_EXIST'), this.getTranslation('TOASTR.TITLE.ERROR'));
        }
    }
    async create(formValue) {
        if (!this.technologyNames.includes(formValue.name.toLocaleLowerCase())) {
            try {
                await this.candidateTechnologiesService.create({
                    ...formValue
                });
                this.toastrService.success('TOASTR.MESSAGE.TECHNOLOGY_STACK_CREATED', {
                    name: formValue.name
                });
                this.loadTechnologies();
                this.communicationService.addTechnology(formValue);
            }
            catch (error) {
                this.toastrError(error);
            }
        }
        else {
            this.toastrService.danger('CANDIDATES_PAGE.CRITERIONS.TOASTR_ALREADY_EXIST');
        }
    }
    async edit(index, id) {
        this.editId = id;
        this.form.controls.technologies.patchValue([this.technologiesList[index]]);
    }
    async remove(technology) {
        try {
            await this.candidateTechnologiesService.delete(technology.id);
            this.loadTechnologies();
            this.communicationService.removeTechnology(technology.id);
            this.toastrService.success('TOASTR.MESSAGE.TECHNOLOGY_STACK_DELETED', {
                name: technology.name
            });
        }
        catch (error) {
            this.toastrError(error);
        }
    }
    ngOnDestroy() {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
    toastrError(error) {
        this.toastrService.danger(this.getTranslation('NOTES.CANDIDATE.EXPERIENCE.ERROR', {
            error: error.error ? error.error.message : error.message
        }), this.getTranslation('TOASTR.TITLE.ERROR'));
    }
    /*
     * Getter for candidate technology form controls array
     */
    get technologies() {
        return this.form.get('technologies');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateTechnologiesComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.ToastrService }, { token: i3.TranslateService }, { token: i2.CandidateTechnologiesService }, { token: i2.Store }, { token: i4.CommunicationService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateTechnologiesComponent, isStandalone: false, selector: "ga-candidate-technologies", usesInheritance: true, ngImport: i0, template: "<nb-card class=\"add-criterion-card mb-0\">\n  <nb-card-header>\n    <h6>\n      {{ 'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_STACK' | translate }}\n    </h6>\n    <div class=\"row m-0 mt-2\">\n      @if (form) {\n        <form class=\"col-12 pl-0\" [formGroup]=\"form\">\n          <div formArrayName=\"technologies\">\n            @for (technology of technologies?.controls; track technology; let i = $index) {\n              <div>\n                <div [formGroupName]=\"i\">\n                  <input\n                    formControlName=\"name\"\n                    class=\"col-12\"\n                    nbInput\n                    type=\"text\"\n                    placeholder=\"{{ 'FORM.PLACEHOLDERS.ADD_TECHNOLOGY' | translate }}\"\n                    fullWidth\n                    />\n                  </div>\n                </div>\n              }\n            </div>\n          </form>\n        }\n      </div>\n      <div class=\"row m-0 mt-3\">\n        <span class=\"col-2 pl-2 pr-1\"\n          ><button class=\"w-100\" nbButton status=\"success\" (click)=\"save()\">\n          {{ 'BUTTONS.SAVE' | translate }}\n        </button></span\n        >\n      </div>\n    </nb-card-header>\n    @if (existedTechNames?.length > 0) {\n      <nb-card-body class=\"existedNames\">\n        <span>{{ 'CANDIDATES_PAGE.CRITERIONS.ALREADY_EXISTED' | translate }}</span>\n        <div class=\"existedNames-card\">\n          @for (name of existedTechNames; track name) {\n            <div class=\"existedName\">\n              {{ name }}\n            </div>\n          }\n        </div>\n      </nb-card-body>\n    }\n    <nb-card-body class=\"technologies\">\n      @for (technology of technologiesList; track technology; let i = $index) {\n        <div class=\"technologies-card\">\n          <div class=\"technology\">\n            <p class=\"technology-text\">{{ technology.name }}</p>\n            <div class=\"technology-buttons\">\n              <nb-icon\n                class=\"technology-buttons-icons pl-1\"\n                icon=\"edit\"\n                (click)=\"edit(i, technology.id)\"\n                ></nb-icon\n                ><nb-icon class=\"technology-buttons-icons pl-1\" icon=\"close\" (click)=\"remove(technology)\"></nb-icon>\n              </div>\n            </div>\n          </div>\n        }\n      </nb-card-body>\n    </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host nb-card{background-color:var(--gauzy-card-1)}.add-criterion{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start}.add-criterion-card{padding:1rem}.technologies{display:flex;flex-direction:row;justify-content:space-between;align-items:center;flex-wrap:wrap}.technologies-card{width:49%}.technology{background-color:var(--gauzy-card-1);border-radius:var(--border-radius);margin:.2rem 0;padding:1rem;display:flex;flex-direction:row;justify-content:space-between;align-items:center}.technology-text{font-weight:500;margin:0}.technology-buttons{display:flex;flex-direction:row;justify-content:space-between;align-items:center}.technology-buttons-icons{font-size:1.4rem;cursor:pointer}.existedNames{display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;background-color:#32323214}.existedNames-card{width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-top:.5rem}.existedNames .existedName{border:1px #ff3d70 solid;margin:.2rem 0;padding:1rem;display:flex;flex-direction:row;justify-content:space-between;align-items:center;width:49%;font-weight:500}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-2)}h6{font-size:14px;font-weight:600;line-height:17px;letter-spacing:-.01em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i1.FormGroupName, selector: "[formGroupName]", inputs: ["formGroupName"] }, { kind: "directive", type: i1.FormArrayName, selector: "[formArrayName]", inputs: ["formArrayName"] }, { kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i5.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateTechnologiesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-technologies', standalone: false, template: "<nb-card class=\"add-criterion-card mb-0\">\n  <nb-card-header>\n    <h6>\n      {{ 'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_STACK' | translate }}\n    </h6>\n    <div class=\"row m-0 mt-2\">\n      @if (form) {\n        <form class=\"col-12 pl-0\" [formGroup]=\"form\">\n          <div formArrayName=\"technologies\">\n            @for (technology of technologies?.controls; track technology; let i = $index) {\n              <div>\n                <div [formGroupName]=\"i\">\n                  <input\n                    formControlName=\"name\"\n                    class=\"col-12\"\n                    nbInput\n                    type=\"text\"\n                    placeholder=\"{{ 'FORM.PLACEHOLDERS.ADD_TECHNOLOGY' | translate }}\"\n                    fullWidth\n                    />\n                  </div>\n                </div>\n              }\n            </div>\n          </form>\n        }\n      </div>\n      <div class=\"row m-0 mt-3\">\n        <span class=\"col-2 pl-2 pr-1\"\n          ><button class=\"w-100\" nbButton status=\"success\" (click)=\"save()\">\n          {{ 'BUTTONS.SAVE' | translate }}\n        </button></span\n        >\n      </div>\n    </nb-card-header>\n    @if (existedTechNames?.length > 0) {\n      <nb-card-body class=\"existedNames\">\n        <span>{{ 'CANDIDATES_PAGE.CRITERIONS.ALREADY_EXISTED' | translate }}</span>\n        <div class=\"existedNames-card\">\n          @for (name of existedTechNames; track name) {\n            <div class=\"existedName\">\n              {{ name }}\n            </div>\n          }\n        </div>\n      </nb-card-body>\n    }\n    <nb-card-body class=\"technologies\">\n      @for (technology of technologiesList; track technology; let i = $index) {\n        <div class=\"technologies-card\">\n          <div class=\"technology\">\n            <p class=\"technology-text\">{{ technology.name }}</p>\n            <div class=\"technology-buttons\">\n              <nb-icon\n                class=\"technology-buttons-icons pl-1\"\n                icon=\"edit\"\n                (click)=\"edit(i, technology.id)\"\n                ></nb-icon\n                ><nb-icon class=\"technology-buttons-icons pl-1\" icon=\"close\" (click)=\"remove(technology)\"></nb-icon>\n              </div>\n            </div>\n          </div>\n        }\n      </nb-card-body>\n    </nb-card>\n", styles: ["@charset \"UTF-8\";:host i{cursor:pointer}:host .cancel{width:100%;display:flex}[dir=ltr] :host .cancel{justify-content:flex-end}[dir=rtl] :host .cancel{justify-content:flex-start}:host .cancel i{font-size:11px;color:var(--gauzy-text-color-1)}:host [nbButton].appearance-outline.status-basic{background-color:transparent;border-color:#f56d584d;border-width:2px;color:#f56d58}:host [nbButton].appearance-outline.status-basic:hover{border-color:#f56d58}:host [nbButton].appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #f56d580d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host .title{color:var(--text-primary-color);font-size:16px;font-weight:600;line-height:16px;letter-spacing:0em}:host [nbButton].gray.appearance-outline.status-basic{background-color:transparent;border-color:#7e7e8f4d;border-width:2px;color:#7e7e8f}:host [nbButton].gray.appearance-outline.status-basic:hover{border-color:#7e7e8f}:host [nbButton].gray.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #7e7e8f0d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].gray.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic{background-color:transparent;border-color:#25b8694d;border-width:2px;color:#25b869}:host [nbButton].green.appearance-outline.status-basic:hover{border-color:#25b869}:host [nbButton].green.appearance-outline:hover{box-shadow:0 0 0 var(--button-outline-width) #25b8690d,inset var(--button-outline-focus-inset-shadow-length) transparent}:host [nbButton].green.appearance-outline:focus:not(:hover):not(:active){box-shadow:unset}:host [nbButton].green.appearance-outline.status-basic[disabled],:host [nbButton].green.appearance-outline.status-basic.btn-disabled{background-color:var(--button-outline-basic-disabled-background-color);border-color:var(--button-outline-basic-disabled-border-color);color:var(--button-outline-basic-disabled-text-color);box-shadow:unset}:host [nbButton].primary.appearance-filled.status-primary{color:var(--text-primary-color);border:unset;background-color:var(--color-primary-transparent-default);box-shadow:var(--gauzy-shadow)}[dir=ltr] :host ::ng-deep input,[dir=ltr] :host ::ng-deep textarea{text-align:start}[dir=rtl] :host ::ng-deep input,[dir=rtl] :host ::ng-deep textarea{text-align:end}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-sidebar-background-4)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep textarea{background-color:var(--gauzy-sidebar-background-4)!important;border:none}:host nb-card{background-color:var(--gauzy-card-1)}.add-criterion{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start}.add-criterion-card{padding:1rem}.technologies{display:flex;flex-direction:row;justify-content:space-between;align-items:center;flex-wrap:wrap}.technologies-card{width:49%}.technology{background-color:var(--gauzy-card-1);border-radius:var(--border-radius);margin:.2rem 0;padding:1rem;display:flex;flex-direction:row;justify-content:space-between;align-items:center}.technology-text{font-weight:500;margin:0}.technology-buttons{display:flex;flex-direction:row;justify-content:space-between;align-items:center}.technology-buttons-icons{font-size:1.4rem;cursor:pointer}.existedNames{display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;background-color:#32323214}.existedNames-card{width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-top:.5rem}.existedNames .existedName{border:1px #ff3d70 solid;margin:.2rem 0;padding:1rem;display:flex;flex-direction:row;justify-content:space-between;align-items:center;width:49%;font-weight:500}:host ::ng-deep input,:host ::ng-deep nb-select.appearance-outline.status-basic .select-button,:host ::ng-deep .ng-select .ng-select-container{background-color:var(--gauzy-card-1)!important;border:none;min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2)!important}:host ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder,:host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{top:unset!important}:host ::ng-deep label,:host ::ng-deep .label{font-size:var(--text-label-font-size);font-weight:600;line-height:.8125rem;letter-spacing:-.01em;color:var(--gauzy-text-color-2)}:host ::ng-deep textarea{background-color:var(--gauzy-card-1)!important;border:none}:host ::ng-deep .ng-select .ng-select-container input,:host ::ng-deep nb-tag-list input{background-color:unset!important}:host nb-card{background-color:var(--gauzy-card-2)}h6{font-size:14px;font-weight:600;line-height:17px;letter-spacing:-.01em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.ToastrService }, { type: i3.TranslateService }, { type: i2.CandidateTechnologiesService }, { type: i2.Store }, { type: i4.CommunicationService }] });
//# sourceMappingURL=candidate-technologies.component.js.map