import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class SingleStatisticComponent {
    constructor() { }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SingleStatisticComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: SingleStatisticComponent, isStandalone: false, selector: "ga-single-statistic", inputs: { title: "title", prefix: "prefix", value: "value", suffix: "suffix", type: "type", color: "color" }, ngImport: i0, template: "<div class=\"statistic-component\">\n  <div class=\"title\">\n    {{ title }}\n  </div>\n  <div class=\"content\">\n    @switch (type) {\n      @case ('highlight') {\n        <span class=\"block-amount\"\n          >{{ prefix }} {{ value }} {{ suffix }}</span\n          >\n        }\n        @default {\n          <span [style.color]=\"color\"> {{ prefix }} {{ value }} {{ suffix }} </span>\n        }\n      }\n    </div>\n  </div>\n", styles: [":host .statistic-component{display:inline-flex;flex-direction:column}:host .title{font-size:var(--text-label-font-size);font-weight:500;line-height:1rem;letter-spacing:-.009em;color:var(--gauzy-text-color-2);margin-bottom:.375rem}:host .content{font-size:var(--text-heading-4-font-size);font-weight:400;line-height:2rem;letter-spacing:0em;color:var(--gauzy-text-color-1);margin-bottom:0}:host .block-amount{color:var(--gauzy-action-success-text);font-weight:500}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SingleStatisticComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-single-statistic', standalone: false, template: "<div class=\"statistic-component\">\n  <div class=\"title\">\n    {{ title }}\n  </div>\n  <div class=\"content\">\n    @switch (type) {\n      @case ('highlight') {\n        <span class=\"block-amount\"\n          >{{ prefix }} {{ value }} {{ suffix }}</span\n          >\n        }\n        @default {\n          <span [style.color]=\"color\"> {{ prefix }} {{ value }} {{ suffix }} </span>\n        }\n      }\n    </div>\n  </div>\n", styles: [":host .statistic-component{display:inline-flex;flex-direction:column}:host .title{font-size:var(--text-label-font-size);font-weight:500;line-height:1rem;letter-spacing:-.009em;color:var(--gauzy-text-color-2);margin-bottom:.375rem}:host .content{font-size:var(--text-heading-4-font-size);font-weight:400;line-height:2rem;letter-spacing:0em;color:var(--gauzy-text-color-1);margin-bottom:0}:host .block-amount{color:var(--gauzy-action-success-text);font-weight:500}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { title: [{
                type: Input
            }], prefix: [{
                type: Input
            }], value: [{
                type: Input
            }], suffix: [{
                type: Input
            }], type: [{
                type: Input
            }], color: [{
                type: Input
            }] } });
//# sourceMappingURL=single-statistic.component.js.map