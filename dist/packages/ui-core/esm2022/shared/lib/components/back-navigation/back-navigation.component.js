import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
export class BackNavigationComponent {
    constructor(location) {
        this.location = location;
        this.haveLink = false;
    }
    ngOnInit() { }
    goBack() {
        if (!this.haveLink)
            this.location.back();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BackNavigationComponent, deps: [{ token: i1.Location }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: BackNavigationComponent, isStandalone: false, selector: "ngx-back-navigation", inputs: { haveLink: "haveLink" }, ngImport: i0, template: "<div class=\"main\">\n\t<button (click)=\"goBack()\" nbButton status=\"primary\" type=\"button\" size=\"small\" outline>\n\t\t<i class=\"fas fa-arrow-left\"></i>\n\t</button>\n</div>\n", styles: [":host .main{display:inline}[dir=ltr] :host .main button{margin-right:1.5rem}[dir=rtl] :host .main button{margin-left:1.5rem}:host .main button{width:1.5rem;height:1.5rem}:host .main button.appearance-outline.status-primary{border-width:2px;border-color:var(--color-primary-transparent-default);padding:.1rem 0}:host .main button i{font-size:11px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BackNavigationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-back-navigation', standalone: false, template: "<div class=\"main\">\n\t<button (click)=\"goBack()\" nbButton status=\"primary\" type=\"button\" size=\"small\" outline>\n\t\t<i class=\"fas fa-arrow-left\"></i>\n\t</button>\n</div>\n", styles: [":host .main{display:inline}[dir=ltr] :host .main button{margin-right:1.5rem}[dir=rtl] :host .main button{margin-left:1.5rem}:host .main button{width:1.5rem;height:1.5rem}:host .main button.appearance-outline.status-primary{border-width:2px;border-color:var(--color-primary-transparent-default);padding:.1rem 0}:host .main button i{font-size:11px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Location }], propDecorators: { haveLink: [{
                type: Input
            }] } });
//# sourceMappingURL=back-navigation.component.js.map