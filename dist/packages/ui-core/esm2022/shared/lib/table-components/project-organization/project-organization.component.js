import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../directives/img.directive";
import * as i3 from "@angular/common";
import * as i4 from "@ngx-translate/core";
import * as i5 from "../../pipes/truncate.pipe";
export class ProjectOrganizationComponent {
    constructor() {
        this.organization = null;
        this.project = {
            name: null,
            count: null,
            imageUrl: null
        };
    }
    ngOnInit() {
        this.project.name = this.rowData.name;
        this.project.count = this.rowData.membersCount;
        this.project.imageUrl = this.rowData.imageUrl;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectOrganizationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProjectOrganizationComponent, isStandalone: false, selector: "gauzy-project-organization", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "@if (project) {\n  <div class=\"project-render\">\n    @if (project?.imageUrl) {\n      <img\n        src=\"{{ project.imageUrl }}\"\n        />\n    }\n    <span>\n      <div class=\"name\">{{ project?.name }}</div>\n      @if (project?.count) {\n        <div class=\"member\">\n          {{ 'FORM.PLACEHOLDERS.MEMBERS_COUNT' | translate }} {{ project?.count }}\n        </div>\n      }\n      @if (rowData?.projectUrl) {\n        <div>\n          <a [href]=\"rowData?.projectUrl\" rel=\"noopener\" target=\"_blank\">{{\n            this.rowData.projectUrl | truncate: 20\n          }}</a>\n        </div>\n      }\n      @if (rowData?.owner) {\n        <div>\n          <nb-badge\n            [status]=\"rowData?.owner === 'INTERNAL' ? 'primary' : 'danger'\"\n            [text]=\"rowData?.owner | titlecase\"\n          ></nb-badge>\n        </div>\n      }\n    </span>\n  </div>\n}\n", styles: [".project-render{width:100%;display:flex;justify-content:flex-start;gap:10px}.project-render img{width:28px;height:28px;border-radius:var(--border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}.project-render span .member{color:var(--gauzy-text-color-2);font-size:11px;font-weight:400;line-height:13px;letter-spacing:0em}.project-render .name{color:var(--gauzy-text-color-1);font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em}nb-badge{margin-top:var(--gauzy-table-chip-block-gap, .25rem);position:relative}:host a{color:var(--text-primary-color)!important;font-size:11px;font-weight:400;line-height:13px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "directive", type: i2.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i3.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }, { kind: "pipe", type: i5.TruncatePipe, name: "truncate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectOrganizationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-project-organization', standalone: false, template: "@if (project) {\n  <div class=\"project-render\">\n    @if (project?.imageUrl) {\n      <img\n        src=\"{{ project.imageUrl }}\"\n        />\n    }\n    <span>\n      <div class=\"name\">{{ project?.name }}</div>\n      @if (project?.count) {\n        <div class=\"member\">\n          {{ 'FORM.PLACEHOLDERS.MEMBERS_COUNT' | translate }} {{ project?.count }}\n        </div>\n      }\n      @if (rowData?.projectUrl) {\n        <div>\n          <a [href]=\"rowData?.projectUrl\" rel=\"noopener\" target=\"_blank\">{{\n            this.rowData.projectUrl | truncate: 20\n          }}</a>\n        </div>\n      }\n      @if (rowData?.owner) {\n        <div>\n          <nb-badge\n            [status]=\"rowData?.owner === 'INTERNAL' ? 'primary' : 'danger'\"\n            [text]=\"rowData?.owner | titlecase\"\n          ></nb-badge>\n        </div>\n      }\n    </span>\n  </div>\n}\n", styles: [".project-render{width:100%;display:flex;justify-content:flex-start;gap:10px}.project-render img{width:28px;height:28px;border-radius:var(--border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}.project-render span .member{color:var(--gauzy-text-color-2);font-size:11px;font-weight:400;line-height:13px;letter-spacing:0em}.project-render .name{color:var(--gauzy-text-color-1);font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em}nb-badge{margin-top:var(--gauzy-table-chip-block-gap, .25rem);position:relative}:host a{color:var(--text-primary-color)!important;font-size:11px;font-weight:400;line-height:13px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=project-organization.component.js.map