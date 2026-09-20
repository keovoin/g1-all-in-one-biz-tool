import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/img.directive";
export class ProjectComponent {
    constructor() {
        this.organization = null;
        this.project = {
            name: null,
            count: null,
            imageUrl: null
        };
        this.projects = [];
    }
    ngOnInit() {
        this.init();
    }
    async init() {
        if (this.rowData?.project || this.value?.project) {
            this.project.name = this.rowData?.project?.name || this.value?.project?.name;
            this.project.count = this.rowData?.project?.membersCount || this.value?.project?.membersCount;
            this.project.imageUrl = this.rowData?.project?.imageUrl || this.value?.project?.imageUrl;
        }
        else if (this.rowData.projects) {
            this.projects = this.rowData.projects.map((project) => {
                return {
                    name: project.name,
                    count: project.membersCount,
                    imageUrl: project.imageUrl
                };
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProjectComponent, isStandalone: false, selector: "ngx-project", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "@if (project) {\n  <div class=\"project-render\">\n    @if (project?.imageUrl) {\n      <img\n        src=\"{{ project.imageUrl }}\"\n        />\n    }\n    <span>\n      <div class=\"name\">{{ project?.name }}</div>\n      @if (project?.count) {\n        <div class=\"member\">\n          Members count {{ project?.count }}\n        </div>\n      }\n    </span>\n  </div>\n}\n@if (projects) {\n  <div class=\"project-render\">\n    @for (project of projects; track project) {\n      @if (project?.imageUrl) {\n        <img\n          src=\"{{ project.imageUrl }}\"\n          />\n      }\n    }\n  </div>\n}\n", styles: [".project-render{width:100%;display:flex;justify-content:flex-start;gap:10px}.project-render img{width:28px;height:28px;border-radius:var(--border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}.project-render span .member{color:var(--gauzy-text-color-2);font-size:11px;font-weight:400;line-height:13px;letter-spacing:0em}.project-render .name{color:var(--gauzy-text-color-1);font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProjectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-project', standalone: false, template: "@if (project) {\n  <div class=\"project-render\">\n    @if (project?.imageUrl) {\n      <img\n        src=\"{{ project.imageUrl }}\"\n        />\n    }\n    <span>\n      <div class=\"name\">{{ project?.name }}</div>\n      @if (project?.count) {\n        <div class=\"member\">\n          Members count {{ project?.count }}\n        </div>\n      }\n    </span>\n  </div>\n}\n@if (projects) {\n  <div class=\"project-render\">\n    @for (project of projects; track project) {\n      @if (project?.imageUrl) {\n        <img\n          src=\"{{ project.imageUrl }}\"\n          />\n      }\n    }\n  </div>\n}\n", styles: [".project-render{width:100%;display:flex;justify-content:flex-start;gap:10px}.project-render img{width:28px;height:28px;border-radius:var(--border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}.project-render span .member{color:var(--gauzy-text-color-2);font-size:11px;font-weight:400;line-height:13px;letter-spacing:0em}.project-render .name{color:var(--gauzy-text-color-1);font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=project.component.js.map