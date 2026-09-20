import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
export class WorkInProgressComponent {
    ngOnInit() { }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkInProgressComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: WorkInProgressComponent, isStandalone: false, selector: "ga-wip", ngImport: i0, template: `
		<div>
			<div style="display: flex; flex-direction: column; align-items: center; margin: 100px 0px;">
				<nb-icon icon="flash-outline" style="font-size:50px; color: #cacaca"></nb-icon>
				<div>{{ 'COMING_SOON' | translate }}</div>
			</div>
		</div>
	`, isInline: true, dependencies: [{ kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkInProgressComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-wip',
                    template: `
		<div>
			<div style="display: flex; flex-direction: column; align-items: center; margin: 100px 0px;">
				<nb-icon icon="flash-outline" style="font-size:50px; color: #cacaca"></nb-icon>
				<div>{{ 'COMING_SOON' | translate }}</div>
			</div>
		</div>
	`,
                    standalone: false
                }]
        }] });
//# sourceMappingURL=work-in-progress.component.js.map