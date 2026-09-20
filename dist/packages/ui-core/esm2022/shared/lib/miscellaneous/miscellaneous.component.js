import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export class MiscellaneousComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MiscellaneousComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: MiscellaneousComponent, isStandalone: false, selector: "ngx-miscellaneous-outlet", ngImport: i0, template: ` <router-outlet></router-outlet> `, isInline: true, dependencies: [{ kind: "directive", type: i1.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MiscellaneousComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-miscellaneous-outlet',
                    template: ` <router-outlet></router-outlet> `,
                    standalone: false
                }]
        }] });
//# sourceMappingURL=miscellaneous.component.js.map