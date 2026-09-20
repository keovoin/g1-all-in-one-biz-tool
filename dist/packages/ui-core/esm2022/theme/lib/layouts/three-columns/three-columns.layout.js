import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../components/header/header.component";
import * as i3 from "../../components/footer/footer.component";
export class ThreeColumnsLayoutComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThreeColumnsLayoutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ThreeColumnsLayoutComponent, isStandalone: false, selector: "ngx-three-columns-layout", ngImport: i0, template: `
		<nb-layout windowMode>
			<nb-layout-header fixed>
				<ngx-header></ngx-header>
			</nb-layout-header>

			<nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
				<ng-content select="nb-menu"></ng-content>
			</nb-sidebar>

			<nb-layout-column class="small"> </nb-layout-column>

			<nb-layout-column>
				<ng-content select="router-outlet"></ng-content>
			</nb-layout-column>

			<nb-layout-column class="small"> </nb-layout-column>

			<nb-layout-footer fixed>
				<ngx-footer></ngx-footer>
			</nb-layout-footer>
		</nb-layout>
	`, isInline: true, styles: [":host .menu-sidebar ::ng-deep .scrollable{padding-top:var(--layout-padding-top)}\n/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbLayoutComponent, selector: "nb-layout", inputs: ["center", "windowMode", "withScroll", "restoreScrollTop"] }, { kind: "component", type: i1.NbLayoutColumnComponent, selector: "nb-layout-column", inputs: ["left", "start"] }, { kind: "component", type: i1.NbLayoutFooterComponent, selector: "nb-layout-footer", inputs: ["fixed"] }, { kind: "component", type: i1.NbLayoutHeaderComponent, selector: "nb-layout-header", inputs: ["fixed", "subheader"] }, { kind: "component", type: i1.NbSidebarComponent, selector: "nb-sidebar", inputs: ["right", "left", "start", "end", "fixed", "containerFixed", "state", "responsive", "tag", "compactedBreakpoints", "collapsedBreakpoints"], outputs: ["stateChange", "responsiveStateChange"] }, { kind: "component", type: i2.HeaderComponent, selector: "ngx-header", inputs: ["position", "expanded"] }, { kind: "component", type: i3.FooterComponent, selector: "ngx-footer" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ThreeColumnsLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-three-columns-layout', template: `
		<nb-layout windowMode>
			<nb-layout-header fixed>
				<ngx-header></ngx-header>
			</nb-layout-header>

			<nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
				<ng-content select="nb-menu"></ng-content>
			</nb-sidebar>

			<nb-layout-column class="small"> </nb-layout-column>

			<nb-layout-column>
				<ng-content select="router-outlet"></ng-content>
			</nb-layout-column>

			<nb-layout-column class="small"> </nb-layout-column>

			<nb-layout-footer fixed>
				<ngx-footer></ngx-footer>
			</nb-layout-footer>
		</nb-layout>
	`, standalone: false, styles: [":host .menu-sidebar ::ng-deep .scrollable{padding-top:var(--layout-padding-top)}\n/*!\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }] });
//# sourceMappingURL=three-columns.layout.js.map