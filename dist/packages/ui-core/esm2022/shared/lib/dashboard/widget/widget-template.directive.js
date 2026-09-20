import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Marker directive to tag ng-template elements as dashboard widgets.
 * Used with @ViewChildren(WidgetTemplateDirective, { read: TemplateRef })
 * to dynamically collect widget templates without requiring duplicate template names.
 *
 * Usage:
 * ```html
 * <ng-template gaWidgetTemplate>
 *   <!-- widget content -->
 * </ng-template>
 * ```
 */
export class WidgetTemplateDirective {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: WidgetTemplateDirective, isStandalone: true, selector: "[gaWidgetTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gaWidgetTemplate]',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=widget-template.directive.js.map