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
export declare class WidgetTemplateDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<WidgetTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WidgetTemplateDirective, "[gaWidgetTemplate]", never, {}, {}, never, never, true, never>;
}
