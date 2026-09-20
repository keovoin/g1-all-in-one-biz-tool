import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
/**
 * Layout shell for the Jobs section (/pages/jobs).
 * Hosts a router-outlet for child routes (Employee, Search, Matching, Proposal Template)
 * registered by job plugins under JOBS_SECTIONS_LOCATION.
 */
export class JobLayoutComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobLayoutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: JobLayoutComponent, isStandalone: false, selector: "ga-job-layout", ngImport: i0, template: ` <router-outlet></router-outlet> `, isInline: true, styles: [":host{display:block;height:100%}\n"], dependencies: [{ kind: "directive", type: i1.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-job-layout', template: ` <router-outlet></router-outlet> `, standalone: false, styles: [":host{display:block;height:100%}\n"] }]
        }] });
//# sourceMappingURL=job-layout.component.js.map