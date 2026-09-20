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
export declare class WindowTemplateDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WindowTemplateDirective, "[gaWindowTemplate]", never, {}, {}, never, never, true, never>;
}
