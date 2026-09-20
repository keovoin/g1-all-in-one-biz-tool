import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NbProgressBarModule } from '@nebular/theme';
import { progressStatus } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
export class CounterPointComponent {
    constructor() {
        this.getProgressStatus = progressStatus;
        this.total = input(0, ...(ngDevMode ? [{ debugName: "total" }] : []));
        this.value = input(0, ...(ngDevMode ? [{ debugName: "value" }] : []));
        this.color = input('', ...(ngDevMode ? [{ debugName: "color" }] : []));
        this.progress = input(false, ...(ngDevMode ? [{ debugName: "progress" }] : []));
        this.points = computed(() => {
            if (this.progress())
                return [];
            const points = [];
            let total = this.total() === 0 ? 86400 : this.total();
            let value = this.value();
            if (total > 24) {
                value = (value / total) * 24;
                total = 24;
            }
            for (let i = 0; i < total; i++) {
                if (i < value) {
                    points.push({ color: this.color() || progressStatus((value / total) * 100) });
                }
                else {
                    points.push({ color: 'basic' });
                }
            }
            return points;
        }, ...(ngDevMode ? [{ debugName: "points" }] : []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CounterPointComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CounterPointComponent, isStandalone: true, selector: "gauzy-counter-point", inputs: { total: { classPropertyName: "total", publicName: "total", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, progress: { classPropertyName: "progress", publicName: "progress", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "@if (!progress()) {\n\t<div class=\"counter\">\n\t\t@for (point of points(); track $index) {\n\t\t\t<div [style.background]=\"'var(--color-' + point.color + '-default)'\" [class]=\"'point ' + point.color\"></div>\n\t\t}\n\t</div>\n} @else {\n\t<div>\n\t\t<nb-progress-bar [value]=\"value()\" [status]=\"getProgressStatus(value())\"></nb-progress-bar>\n\t</div>\n}\n", styles: [":host .point{width:100%;height:6px;border-radius:3px}[dir=ltr] :host .point{margin-right:3px}[dir=rtl] :host .point{margin-left:3px}:host .point.basic{background-color:var(--gauzy-hover-tint)!important}.counter{display:flex;flex-direction:row;width:100%;height:6px;justify-content:space-between}:host ::ng-deep nb-progress-bar .progress-container{height:6px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbProgressBarModule }, { kind: "component", type: i1.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CounterPointComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-counter-point', standalone: true, imports: [NbProgressBarModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (!progress()) {\n\t<div class=\"counter\">\n\t\t@for (point of points(); track $index) {\n\t\t\t<div [style.background]=\"'var(--color-' + point.color + '-default)'\" [class]=\"'point ' + point.color\"></div>\n\t\t}\n\t</div>\n} @else {\n\t<div>\n\t\t<nb-progress-bar [value]=\"value()\" [status]=\"getProgressStatus(value())\"></nb-progress-bar>\n\t</div>\n}\n", styles: [":host .point{width:100%;height:6px;border-radius:3px}[dir=ltr] :host .point{margin-right:3px}[dir=rtl] :host .point{margin-left:3px}:host .point.basic{background-color:var(--gauzy-hover-tint)!important}.counter{display:flex;flex-direction:row;width:100%;height:6px;justify-content:space-between}:host ::ng-deep nb-progress-bar .progress-container{height:6px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { total: [{ type: i0.Input, args: [{ isSignal: true, alias: "total", required: false }] }], value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }], progress: [{ type: i0.Input, args: [{ isSignal: true, alias: "progress", required: false }] }] } });
//# sourceMappingURL=counter-point.component.js.map