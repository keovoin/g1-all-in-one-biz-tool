import { Component, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
export class UnderConstructionPopupComponent {
    get popup() {
        return this._popup;
    }
    set popup(content) {
        if (content) {
            this._popup = content;
        }
    }
    constructor() {
        this.onClosed = new EventEmitter();
    }
    close() {
        this.onClosed.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UnderConstructionPopupComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: UnderConstructionPopupComponent, isStandalone: false, selector: "gauzy-under-construction-popup", outputs: { onClosed: "onClosed" }, viewQueries: [{ propertyName: "popup", first: true, predicate: ["popup"], descendants: true }], ngImport: i0, template: "<ng-container [ngTemplateOutlet]=\"popup\"></ng-container>\n<ng-template #popup>\n\t<nb-card>\n\t\t<nb-card-body>\n\t\t\t<div class=\"close-popup\">\n\t\t\t\t<span><i (click)=\"close()\" class=\"fas fa-times\"></i></span>\n\t\t\t</div>\n\t\t\t<div class=\"content\">\n\t\t\t\t<img\n\t\t\t\t\twidth=\"48px\"\n\t\t\t\t\theight=\"48px\"\n\t\t\t\t\tsrc=\"/assets/images/others/under-construction.webp\"\n\t\t\t\t\talt=\"Under Construction\"\n\t\t\t\t/>\n\t\t\t\t<p>\n\t\t\t\t\tWe are working hard to implement this feature in our future releases.<br />\n\t\t\t\t\t<strong>Stay tuned!</strong>\n\t\t\t\t</p>\n\t\t\t\t<button class=\"button info\" nbButton status=\"info\" size=\"small\" (click)=\"close()\">Ok</button>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t</nb-card>\n</ng-template>\n", styles: [".button{padding:10px 20px;width:62px;height:36px}.button.info{color:var(--text-control-color);background-color:#0088fe}.button{box-shadow:var(--gauzy-shadow);border-radius:30px;margin-top:22px}nb-card{width:300px;height:404px;box-shadow:0 6px 30px #0003;border-radius:12px}img{width:226px;height:172px;border-radius:var(--border-radius);margin-bottom:22px}p{width:226px;text-align:center}nb-card-body{display:flex;flex-direction:column;align-items:center;border-radius:12px;padding:1rem}.content{display:flex;flex-direction:column;align-items:center;justify-content:space-between}.close-popup{width:100%;display:flex;justify-content:flex-end}i{cursor:pointer}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UnderConstructionPopupComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-under-construction-popup', standalone: false, template: "<ng-container [ngTemplateOutlet]=\"popup\"></ng-container>\n<ng-template #popup>\n\t<nb-card>\n\t\t<nb-card-body>\n\t\t\t<div class=\"close-popup\">\n\t\t\t\t<span><i (click)=\"close()\" class=\"fas fa-times\"></i></span>\n\t\t\t</div>\n\t\t\t<div class=\"content\">\n\t\t\t\t<img\n\t\t\t\t\twidth=\"48px\"\n\t\t\t\t\theight=\"48px\"\n\t\t\t\t\tsrc=\"/assets/images/others/under-construction.webp\"\n\t\t\t\t\talt=\"Under Construction\"\n\t\t\t\t/>\n\t\t\t\t<p>\n\t\t\t\t\tWe are working hard to implement this feature in our future releases.<br />\n\t\t\t\t\t<strong>Stay tuned!</strong>\n\t\t\t\t</p>\n\t\t\t\t<button class=\"button info\" nbButton status=\"info\" size=\"small\" (click)=\"close()\">Ok</button>\n\t\t\t</div>\n\t\t</nb-card-body>\n\t</nb-card>\n</ng-template>\n", styles: [".button{padding:10px 20px;width:62px;height:36px}.button.info{color:var(--text-control-color);background-color:#0088fe}.button{box-shadow:var(--gauzy-shadow);border-radius:30px;margin-top:22px}nb-card{width:300px;height:404px;box-shadow:0 6px 30px #0003;border-radius:12px}img{width:226px;height:172px;border-radius:var(--border-radius);margin-bottom:22px}p{width:226px;text-align:center}nb-card-body{display:flex;flex-direction:column;align-items:center;border-radius:12px;padding:1rem}.content{display:flex;flex-direction:column;align-items:center;justify-content:space-between}.close-popup{width:100%;display:flex;justify-content:flex-end}i{cursor:pointer}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { onClosed: [{
                type: Output
            }], popup: [{
                type: ViewChild,
                args: ['popup']
            }] } });
//# sourceMappingURL=popup.component.js.map