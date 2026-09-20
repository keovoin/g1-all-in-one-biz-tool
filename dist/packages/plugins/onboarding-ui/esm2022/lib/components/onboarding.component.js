import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/theme";
export class OnboardingComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OnboardingComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: OnboardingComponent, isStandalone: false, selector: "ga-onboarding", ngImport: i0, template: `
		<nb-layout windowMode>
			<ngx-theme-settings></ngx-theme-settings>
			<nb-layout-column>
				<router-outlet></router-outlet>
			</nb-layout-column>
		</nb-layout>
	`, isInline: true, dependencies: [{ kind: "directive", type: i1.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }, { kind: "component", type: i2.NbLayoutComponent, selector: "nb-layout", inputs: ["center", "windowMode", "withScroll", "restoreScrollTop"] }, { kind: "component", type: i2.NbLayoutColumnComponent, selector: "nb-layout-column", inputs: ["left", "start"] }, { kind: "component", type: i3.ThemeSettingsComponent, selector: "ngx-theme-settings" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OnboardingComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-onboarding',
                    template: `
		<nb-layout windowMode>
			<ngx-theme-settings></ngx-theme-settings>
			<nb-layout-column>
				<router-outlet></router-outlet>
			</nb-layout-column>
		</nb-layout>
	`,
                    standalone: false
                }]
        }] });
//# sourceMappingURL=onboarding.component.js.map