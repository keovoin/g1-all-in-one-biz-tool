import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
export class ProposalStatusComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalStatusComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ProposalStatusComponent, isStandalone: false, selector: "ga-proposal-status", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: "@if (rowData.status == 'SENT') {\n  <div class=\"text-center d-block\">\n    <div class=\"badge-warning\">\n      {{ 'BUTTONS.SENT' | translate }}\n    </div>\n  </div>\n} @else {\n  <div class=\"text-center d-block\">\n    <div class=\"badge-success\">\n      {{ 'BUTTONS.ACCEPTED' | translate }}\n    </div>\n  </div>\n}\n", styles: ["div{border-radius:1rem;align-content:center;display:flex;justify-content:center}.badge-warning,.badge-success{text-align:center;color:#fff;padding:5px 30px;margin-bottom:5px}\n"], dependencies: [{ kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalStatusComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-proposal-status', standalone: false, template: "@if (rowData.status == 'SENT') {\n  <div class=\"text-center d-block\">\n    <div class=\"badge-warning\">\n      {{ 'BUTTONS.SENT' | translate }}\n    </div>\n  </div>\n} @else {\n  <div class=\"text-center d-block\">\n    <div class=\"badge-success\">\n      {{ 'BUTTONS.ACCEPTED' | translate }}\n    </div>\n  </div>\n}\n", styles: ["div{border-radius:1rem;align-content:center;display:flex;justify-content:center}.badge-warning,.badge-success{text-align:center;color:#fff;padding:5px 30px;margin-bottom:5px}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=proposal-status.component.js.map