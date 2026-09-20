import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../pipes/date-format.pipe";
import * as i3 from "../../pipes/datetime-format.pipe";
export class CreatedAtComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreatedAtComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CreatedAtComponent, isStandalone: false, selector: "ngx-created-at", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<span [nbTooltip]=\"value | dateTimeFormat\">{{ value | dateFormat : null : 'll' }}</span>\n", styles: ["span{display:inline-block;text-transform:lowercase}span:first-letter{text-transform:uppercase}\n"], dependencies: [{ kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i2.DateFormatPipe, name: "dateFormat" }, { kind: "pipe", type: i3.DateTimeFormatPipe, name: "dateTimeFormat" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CreatedAtComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-created-at', standalone: false, template: "<span [nbTooltip]=\"value | dateTimeFormat\">{{ value | dateFormat : null : 'll' }}</span>\n", styles: ["span{display:inline-block;text-transform:lowercase}span:first-letter{text-transform:uppercase}\n"] }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=created-at.component.js.map