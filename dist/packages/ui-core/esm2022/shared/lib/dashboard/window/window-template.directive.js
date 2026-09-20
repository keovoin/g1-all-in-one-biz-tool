import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Marker directive to tag ng-template elements as dashboard windows.
 * Used with @ViewChildren(WindowTemplateDirective, { read: TemplateRef })
 * to dynamically collect window templates without requiring duplicate template names.
 *
 * Usage:
 * ```html
 * <ng-template gaWindowTemplate>
 *   <!-- window content -->
 * </ng-template>
 * ```
 */
export class WindowTemplateDirective {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: WindowTemplateDirective, isStandalone: true, selector: "[gaWindowTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gaWindowTemplate]',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=window-template.directive.js.map