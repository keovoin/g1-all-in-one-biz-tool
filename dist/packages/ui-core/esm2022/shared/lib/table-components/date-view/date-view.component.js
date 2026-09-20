import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "../../pipes/date-format.pipe";
export class DateViewComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateViewComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DateViewComponent, isStandalone: false, selector: "ngx-date-view", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: `
		<span>
		  <span [nbTooltip]="value | dateFormat">{{ value | dateFormat : null : 'll' }}</span>
		  @if (rowData?.recurring) {
		    <nb-icon
		      [nbTooltip]="'POP_UPS.RECURRING_EXPENSE' | translate"
		      icon="sync-outline"
		    ></nb-icon>
		  }
		</span>
		`, isInline: true, dependencies: [{ kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }, { kind: "pipe", type: i3.DateFormatPipe, name: "dateFormat" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-date-view', template: `
		<span>
		  <span [nbTooltip]="value | dateFormat">{{ value | dateFormat : null : 'll' }}</span>
		  @if (rowData?.recurring) {
		    <nb-icon
		      [nbTooltip]="'POP_UPS.RECURRING_EXPENSE' | translate"
		      icon="sync-outline"
		    ></nb-icon>
		  }
		</span>
		`, standalone: false }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=date-view.component.js.map