import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../directives/img.directive";
export class GithubRepositoryComponent {
    constructor() { }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GithubRepositoryComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: GithubRepositoryComponent, isStandalone: false, selector: "ngx-github-repository", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<div class=\"repository-render\">\n\t<img src=\"assets/images/integrations/github.svg\" />\n\t<span>\n\t\t<div class=\"name\">{{ rowData?.customFields?.repository?.fullName }}</div>\n\t</span>\n</div>\n", styles: [".repository-render{width:100%;display:flex;justify-content:flex-start;gap:10px}.repository-render img{width:28px;height:28px;border-radius:nb-theme(border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}.repository-render .name{color:var(--gauzy-text-color-1);font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GithubRepositoryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-github-repository', standalone: false, template: "<div class=\"repository-render\">\n\t<img src=\"assets/images/integrations/github.svg\" />\n\t<span>\n\t\t<div class=\"name\">{{ rowData?.customFields?.repository?.fullName }}</div>\n\t</span>\n</div>\n", styles: [".repository-render{width:100%;display:flex;justify-content:flex-start;gap:10px}.repository-render img{width:28px;height:28px;border-radius:nb-theme(border-radius);box-shadow:var(--gauzy-shadow);object-fit:cover}.repository-render .name{color:var(--gauzy-text-color-1);font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=repository.component.js.map