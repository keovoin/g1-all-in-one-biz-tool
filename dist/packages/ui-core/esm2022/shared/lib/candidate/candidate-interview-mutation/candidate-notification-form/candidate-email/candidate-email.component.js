import { Component, Input, inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { CandidatesService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "../../../../rich-text-editor/rich-text-editor.component";
import * as i4 from "@ngx-translate/core";
export class CandidateEmailComponent {
    constructor() {
        this.candidatesService = inject(CandidatesService);
        this.fb = inject(UntypedFormBuilder);
    }
    ngOnInit() {
        this.loadFormData();
        this.setTemplate();
        this.form.patchValue({
            text: this.isCandidate ? this.textTemplate : this.textTemplate + this.candidateNameTemplate
        });
    }
    loadFormData() {
        this.form = this.fb.group({
            text: [this.emailText]
        });
    }
    onChange(value) {
        this.emailText = value;
    }
    setTemplate() {
        this.candidateName = this.selectedCandidate.user.firstName + ' ' + this.selectedCandidate.user.lastName;
        this.getDate(this.templateData.startTime, this.templateData.endTime);
        const res = [];
        this.employees.forEach((employee) => {
            res.push(employee.user.firstName + ' ' + employee.user.lastName);
        });
        this.employeeList = res.join(', ');
        this.textTemplate = `
	 	<p>You are invited to <strong> ${this.templateData.title}</strong></p>
		<p>When <strong> ${this.dateTemplate}</strong></p>
		<p>Where <strong> ${this.templateData.location || 'Online'}</strong></p>
		<p>Interviewer(s) <strong>${this.employeeList}</strong></p>	`;
        this.candidateNameTemplate = `
	 	<p>Candidate <strong> ${this.candidateName}</strong></p>`;
    }
    getDate(startTime, endTime) {
        this.dateTemplate = startTime.toDateString() + ', ' + this.getTime(startTime) + '-' + this.getTime(endTime);
    }
    getTime(time) {
        const hours = time.getHours();
        let minutes = time.getMinutes();
        if (minutes === 0) {
            minutes = '00';
        }
        return hours + ':' + minutes;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateEmailComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateEmailComponent, isStandalone: false, selector: "ga-candidate-email", inputs: { isCandidate: "isCandidate", templateData: "templateData", selectedCandidate: "selectedCandidate", employees: "employees" }, ngImport: i0, template: "<nb-card class=\"email-wrap\">\n  <nb-card-body class=\"info-block\">\n    @if (isCandidate) {\n      <div>\n        <span>{{\n          'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.TO' | translate\n        }}</span>\n        <span class=\"email\">{{ selectedCandidate?.user.email }}</span>\n      </div>\n    }\n    @if (!isCandidate) {\n      <div>\n        <span>{{\n          'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.TO' | translate\n        }}</span>\n        @for (employee of employees; track employee) {\n          <span class=\"email\">{{\n            employee?.user.email\n          }}</span>\n        }\n      </div>\n    }\n  </nb-card-body>\n  <nb-card-body class=\"info-block\">\n    {{ templateData?.title }}\n    {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.ON' | translate }}\n    {{ dateTemplate }}\n  </nb-card-body>\n  <nb-card-body class=\"editor\">\n    @if (form) {\n      <form [formGroup]=\"form\">\n        <ga-rich-text-editor\n          formControlName=\"text\"\n          preset=\"email\"\n          outputFormat=\"html\"\n          (changed)=\"onChange($event)\"\n        ></ga-rich-text-editor>\n      </form>\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".email-wrap{max-width:45rem}.info-block{border-top:1px #d1d1d1 solid;border-left:1px #d1d1d1 solid;border-right:1px #d1d1d1 solid}:host .email{border:1px #d1d1d1 solid}[dir=ltr] :host .email{margin-left:15px}[dir=rtl] :host .email{margin-right:15px}:host .email{border-radius:5px}[dir=ltr] :host .editor{padding:0 2px 0 0}[dir=rtl] :host .editor{padding:0 0 0 2px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i3.RichTextEditorComponent, selector: "ga-rich-text-editor", inputs: ["preset", "placeholder", "outputFormat", "minHeight", "maxHeight", "characterLimit", "showCharacterCount", "editorClass", "disabled"], outputs: ["created", "changed", "focused", "blurred"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateEmailComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-email', standalone: false, template: "<nb-card class=\"email-wrap\">\n  <nb-card-body class=\"info-block\">\n    @if (isCandidate) {\n      <div>\n        <span>{{\n          'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.TO' | translate\n        }}</span>\n        <span class=\"email\">{{ selectedCandidate?.user.email }}</span>\n      </div>\n    }\n    @if (!isCandidate) {\n      <div>\n        <span>{{\n          'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.TO' | translate\n        }}</span>\n        @for (employee of employees; track employee) {\n          <span class=\"email\">{{\n            employee?.user.email\n          }}</span>\n        }\n      </div>\n    }\n  </nb-card-body>\n  <nb-card-body class=\"info-block\">\n    {{ templateData?.title }}\n    {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.ON' | translate }}\n    {{ dateTemplate }}\n  </nb-card-body>\n  <nb-card-body class=\"editor\">\n    @if (form) {\n      <form [formGroup]=\"form\">\n        <ga-rich-text-editor\n          formControlName=\"text\"\n          preset=\"email\"\n          outputFormat=\"html\"\n          (changed)=\"onChange($event)\"\n        ></ga-rich-text-editor>\n      </form>\n    }\n  </nb-card-body>\n</nb-card>\n", styles: [".email-wrap{max-width:45rem}.info-block{border-top:1px #d1d1d1 solid;border-left:1px #d1d1d1 solid;border-right:1px #d1d1d1 solid}:host .email{border:1px #d1d1d1 solid}[dir=ltr] :host .email{margin-left:15px}[dir=rtl] :host .email{margin-right:15px}:host .email{border-radius:5px}[dir=ltr] :host .editor{padding:0 2px 0 0}[dir=rtl] :host .editor{padding:0 0 0 2px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { isCandidate: [{
                type: Input
            }], templateData: [{
                type: Input
            }], selectedCandidate: [{
                type: Input
            }], employees: [{
                type: Input
            }] } });
//# sourceMappingURL=candidate-email.component.js.map