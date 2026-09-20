import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@gauzy/ui-core/theme";
export class PublicLayoutComponent extends TranslationBaseComponent {
    constructor(translateService) {
        super(translateService);
        this.translateService = translateService;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutComponent, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PublicLayoutComponent, isStandalone: false, selector: "gz-public-layout", usesInheritance: true, ngImport: i0, template: `
		<ngx-public-layout>
			<router-outlet></router-outlet>
		</ngx-public-layout>
	`, isInline: true, dependencies: [{ kind: "directive", type: i2.RouterOutlet, selector: "router-outlet", inputs: ["name", "routerOutletData"], outputs: ["activate", "deactivate", "attach", "detach"], exportAs: ["outlet"] }, { kind: "component", type: i3.PublicLayoutComponent, selector: "ngx-public-layout" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PublicLayoutComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'gz-public-layout',
                    template: `
		<ngx-public-layout>
			<router-outlet></router-outlet>
		</ngx-public-layout>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.TranslateService }] });
//# sourceMappingURL=public-layout.component.js.map