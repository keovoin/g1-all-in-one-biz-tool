import { Component, Input } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { Store } from '@gauzy/ui-core/core';
import { CandidatePersonalQualitiesService, CandidateTechnologiesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
export class CandidateCriterionsFormComponent {
    constructor(fb, candidateTechnologiesService, candidatePersonalQualitiesService, store) {
        this.fb = fb;
        this.candidateTechnologiesService = candidateTechnologiesService;
        this.candidatePersonalQualitiesService = candidatePersonalQualitiesService;
        this.store = store;
        this.editSelectedTechnologies = [];
        this.editSelectedQualities = [];
        this._ngDestroy$ = new Subject();
        this.selectedTechnologies = [];
        this.selectedQualities = [];
        this.checkedTech = [];
        this.checkedQual = [];
    }
    ngOnInit() {
        this.organization = this.store.selectedOrganization;
        this.loadCriterions();
    }
    loadFormData() {
        this.form = this.fb.group({
            selectedTechnologies: [this.selectedTechnologies],
            selectedQualities: [this.selectedQualities]
        });
    }
    checkedTechnologies(value) {
        if (!this.selectedTechnologies.includes(value)) {
            this.selectedTechnologies.push(value);
        }
        else {
            this.selectedTechnologies.splice(this.selectedTechnologies.findIndex((item) => item === value), 1);
        }
    }
    checkedQualities(value) {
        if (!this.selectedQualities.includes(value)) {
            this.selectedQualities.push(value);
        }
        else {
            this.selectedQualities.splice(this.selectedQualities.findIndex((item) => item === value), 1);
        }
    }
    async loadCriterions() {
        const { id: organizationId, tenantId } = this.organization;
        const technologies = await this.candidateTechnologiesService.getAll({
            organizationId,
            tenantId
        });
        if (technologies) {
            this.technologiesList = technologies.items.filter((item) => !item.interviewId);
            if (this.editSelectedTechnologies) {
                this.isChecked(this.editSelectedTechnologies, this.technologiesList, true);
            }
        }
        const qualities = await this.candidatePersonalQualitiesService.getAll({
            organizationId,
            tenantId
        });
        if (qualities) {
            this.personalQualitiesList = qualities.items.filter((item) => !item.interviewId);
            if (this.editSelectedQualities) {
                this.isChecked(this.editSelectedQualities, this.personalQualitiesList, false);
            }
        }
    }
    isChecked(criterions, allCriterions, isTech) {
        const names = [];
        criterions.forEach((a) => {
            names.push(a.name);
        });
        allCriterions.forEach((itemCheck) => {
            names.includes(itemCheck.name)
                ? isTech
                    ? this.checkedTech.push(1)
                    : this.checkedQual.push(1)
                : isTech
                    ? this.checkedTech.push(0)
                    : this.checkedQual.push(0);
        });
    }
    ngOnDestroy() {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCriterionsFormComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.CandidateTechnologiesService }, { token: i2.CandidatePersonalQualitiesService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateCriterionsFormComponent, isStandalone: false, selector: "ga-candidate-criterions-form", inputs: { editSelectedTechnologies: "editSelectedTechnologies", editSelectedQualities: "editSelectedQualities" }, ngImport: i0, template: "<form class=\"form\">\n  <strong class=\"form-title\">\n    <nb-icon icon=\"funnel-outline\" class=\"title-icon\"></nb-icon\n      >{{\n      'CANDIDATES_PAGE.CRITERIONS.CHOOSE_CRITERIONS' | translate\n      }}</strong\n      >\n      <div class=\"form-blocks\">\n        <div class=\"form-block\">\n          @if (technologiesList?.length > 0) {\n            <div class=\"label mb-2\">\n              {{ 'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_STACK' | translate }}\n            </div>\n          }\n          @for (technology of technologiesList; track technology; let i = $index) {\n            <div>\n              <nb-checkbox\n                (checkedChange)=\"checkedTechnologies(technology.name)\"\n                [checked]=\"checkedTech[i]\"\n                >{{ technology.name }}</nb-checkbox\n                >\n              </div>\n            }\n            @if (technologiesList?.length === 0) {\n              <div class=\"placeholder\">\n                {{\n                'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_PLACEHOLDER'\n                | translate\n                }}\n              </div>\n            }\n          </div>\n          <div class=\"form-block\">\n            @if (personalQualitiesList?.length > 0) {\n              <div class=\"label mb-2\">\n                {{\n                'CANDIDATES_PAGE.CRITERIONS.PERSONAL_QUALITIES' | translate\n                }}\n              </div>\n            }\n            @for (quality of personalQualitiesList; track quality; let i = $index) {\n              <div>\n                <nb-checkbox\n                  (checkedChange)=\"checkedQualities(quality.name)\"\n                  [checked]=\"checkedQual[i]\"\n                  >{{ quality.name }}</nb-checkbox\n                  >\n                </div>\n              }\n              @if (personalQualitiesList?.length === 0) {\n                <div\n                  class=\"placeholder\"\n                  >\n                  {{\n                  'CANDIDATES_PAGE.CRITERIONS.PERSONAL_QUALITIES_PLACEHOLDER'\n                  | translate\n                  }}\n                </div>\n              }\n            </div>\n          </div>\n        </form>\n", styles: [":host .form{width:45rem;display:flex;flex-direction:column;justify-content:space-between;align-items:stretch;padding-bottom:1.5rem}:host .form-block{width:48%;border:1px #e4e9f2 solid;padding:1rem}:host .form-block .placeholder{color:var(--gauzy-text-color-1);font-family:Open Sans,sans-serif;font-size:.8rem;font-weight:600;line-height:1rem;text-align:center}:host .form-blocks{display:flex;flex-direction:row;justify-content:space-between;align-items:stretch}:host .form-title{color:#8f9bb3;font-size:15px}[dir=ltr] :host .form-title{padding:0 0 5px 5px}[dir=rtl] :host .form-title{padding:0 5px 5px 0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.NgForm, selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "component", type: i3.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCriterionsFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-criterions-form', standalone: false, template: "<form class=\"form\">\n  <strong class=\"form-title\">\n    <nb-icon icon=\"funnel-outline\" class=\"title-icon\"></nb-icon\n      >{{\n      'CANDIDATES_PAGE.CRITERIONS.CHOOSE_CRITERIONS' | translate\n      }}</strong\n      >\n      <div class=\"form-blocks\">\n        <div class=\"form-block\">\n          @if (technologiesList?.length > 0) {\n            <div class=\"label mb-2\">\n              {{ 'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_STACK' | translate }}\n            </div>\n          }\n          @for (technology of technologiesList; track technology; let i = $index) {\n            <div>\n              <nb-checkbox\n                (checkedChange)=\"checkedTechnologies(technology.name)\"\n                [checked]=\"checkedTech[i]\"\n                >{{ technology.name }}</nb-checkbox\n                >\n              </div>\n            }\n            @if (technologiesList?.length === 0) {\n              <div class=\"placeholder\">\n                {{\n                'CANDIDATES_PAGE.CRITERIONS.TECHNOLOGY_PLACEHOLDER'\n                | translate\n                }}\n              </div>\n            }\n          </div>\n          <div class=\"form-block\">\n            @if (personalQualitiesList?.length > 0) {\n              <div class=\"label mb-2\">\n                {{\n                'CANDIDATES_PAGE.CRITERIONS.PERSONAL_QUALITIES' | translate\n                }}\n              </div>\n            }\n            @for (quality of personalQualitiesList; track quality; let i = $index) {\n              <div>\n                <nb-checkbox\n                  (checkedChange)=\"checkedQualities(quality.name)\"\n                  [checked]=\"checkedQual[i]\"\n                  >{{ quality.name }}</nb-checkbox\n                  >\n                </div>\n              }\n              @if (personalQualitiesList?.length === 0) {\n                <div\n                  class=\"placeholder\"\n                  >\n                  {{\n                  'CANDIDATES_PAGE.CRITERIONS.PERSONAL_QUALITIES_PLACEHOLDER'\n                  | translate\n                  }}\n                </div>\n              }\n            </div>\n          </div>\n        </form>\n", styles: [":host .form{width:45rem;display:flex;flex-direction:column;justify-content:space-between;align-items:stretch;padding-bottom:1.5rem}:host .form-block{width:48%;border:1px #e4e9f2 solid;padding:1rem}:host .form-block .placeholder{color:var(--gauzy-text-color-1);font-family:Open Sans,sans-serif;font-size:.8rem;font-weight:600;line-height:1rem;text-align:center}:host .form-blocks{display:flex;flex-direction:row;justify-content:space-between;align-items:stretch}:host .form-title{color:#8f9bb3;font-size:15px}[dir=ltr] :host .form-title{padding:0 0 5px 5px}[dir=rtl] :host .form-title{padding:0 5px 5px 0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.CandidateTechnologiesService }, { type: i2.CandidatePersonalQualitiesService }, { type: i2.Store }], propDecorators: { editSelectedTechnologies: [{
                type: Input
            }], editSelectedQualities: [{
                type: Input
            }] } });
//# sourceMappingURL=candidate-criterions-form.component.js.map