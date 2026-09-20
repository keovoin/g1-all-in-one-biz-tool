import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../theme-selector.component";
import * as i3 from "../theme-selector-image/theme-selector-image.component";
export class ThemeSelectorContainerComponent {
    constructor() {
        this.isClassic = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorContainerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ThemeSelectorContainerComponent, isStandalone: false, selector: "ngx-theme-selector-container", inputs: { isClassic: "isClassic" }, ngImport: i0, template: "<ng-container>\n\t<ng-template [ngTemplateOutlet]=\"isClassic ? classic : card\"></ng-template>\n</ng-container>\n\n<ng-template #classic>\n\t<gauzy-theme-selector></gauzy-theme-selector>\n</ng-template>\n\n<ng-template #card>\n\t<gauzy-theme-selector-image></gauzy-theme-selector-image>\n</ng-template>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.ThemeSelectorComponent, selector: "gauzy-theme-selector" }, { kind: "component", type: i3.ThemeSelectorImageComponent, selector: "gauzy-theme-selector-image" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThemeSelectorContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-theme-selector-container', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<ng-container>\n\t<ng-template [ngTemplateOutlet]=\"isClassic ? classic : card\"></ng-template>\n</ng-container>\n\n<ng-template #classic>\n\t<gauzy-theme-selector></gauzy-theme-selector>\n</ng-template>\n\n<ng-template #card>\n\t<gauzy-theme-selector-image></gauzy-theme-selector-image>\n</ng-template>\n" }]
        }], propDecorators: { isClassic: [{
                type: Input
            }] } });
//# sourceMappingURL=theme-selector-container.component.js.map