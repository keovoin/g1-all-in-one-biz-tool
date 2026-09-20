import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../pipes/nl2br.pipe";
export class TrustHtmlLinkComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TrustHtmlLinkComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: TrustHtmlLinkComponent, isStandalone: false, selector: "ngx-security-trust-html", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<p [innerHTML]=\"value | nl2br\"></p>\n", dependencies: [{ kind: "pipe", type: i1.Nl2BrPipe, name: "nl2br" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TrustHtmlLinkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-security-trust-html', standalone: false, template: "<p [innerHTML]=\"value | nl2br\"></p>\n" }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=trust-html.component.js.map