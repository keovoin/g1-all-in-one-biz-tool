import { Component, Input } from '@angular/core';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export class StatusBadgeComponent {
    constructor() { }
    ngOnInit() {
        if (this.value && this.value.text) {
            if (this.layout === ComponentLayoutStyleEnum.CARDS_GRID) {
                if (typeof this.value === 'object') {
                    this.text = this.value['text'];
                    this.badgeClass = 'badge badge-' + this.value['class'];
                }
                else {
                    this.text = this.value;
                }
            }
            else {
                this.text = this.value['text'];
                this.badgeClass = 'badge badge-' + this.value['class'];
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: StatusBadgeComponent, isStandalone: false, selector: "ga-status-badge", inputs: { value: "value", layout: "layout" }, ngImport: i0, template: "<div [class]=\"badgeClass\" [innerHtml]=\"text\"></div>", styles: ["div{border-radius:var(--gauzy-table-badge-radius, .25rem);display:flex;align-items:center;justify-content:center;width:100%;min-height:var(--gauzy-table-badge-height, 1.25rem);padding-block:calc((var(--gauzy-table-badge-height, 1.25rem) - var(--gauzy-table-header-line-height, .9375rem)) / 2);padding-inline:var(--gauzy-table-chip-padding-x, .3125rem);font-size:var(--gauzy-table-header-font-size, .75rem);font-weight:600;line-height:var(--gauzy-table-header-line-height, .9375rem);letter-spacing:0em;text-align:center}.badge{display:flex;justify-content:center;align-items:center}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-status-badge', standalone: false, template: "<div [class]=\"badgeClass\" [innerHtml]=\"text\"></div>", styles: ["div{border-radius:var(--gauzy-table-badge-radius, .25rem);display:flex;align-items:center;justify-content:center;width:100%;min-height:var(--gauzy-table-badge-height, 1.25rem);padding-block:calc((var(--gauzy-table-badge-height, 1.25rem) - var(--gauzy-table-header-line-height, .9375rem)) / 2);padding-inline:var(--gauzy-table-chip-padding-x, .3125rem);font-size:var(--gauzy-table-header-font-size, .75rem);font-weight:600;line-height:var(--gauzy-table-header-line-height, .9375rem);letter-spacing:0em;text-align:center}.badge{display:flex;justify-content:center;align-items:center}\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], layout: [{
                type: Input
            }] } });
//# sourceMappingURL=status-badge.component.js.map