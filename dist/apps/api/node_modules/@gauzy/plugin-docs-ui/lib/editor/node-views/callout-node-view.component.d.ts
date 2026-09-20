import { AngularNodeViewComponent } from '../node-view/angular-node-view-renderer';
import { CalloutType } from '../extensions/callout.node';
import * as i0 from "@angular/core";
/**
 * Interactive node view for `callout` (spec 05 §6.2): status icon (or emoji
 * override) with a type-switcher popover and an editable content hole.
 */
export declare class CalloutNodeViewComponent extends AngularNodeViewComponent {
    switcherOpen: boolean;
    readonly types: CalloutType[];
    get type(): CalloutType;
    get emoji(): string | null;
    get icon(): string;
    iconOf(type: CalloutType): string;
    setType(type: CalloutType): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CalloutNodeViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CalloutNodeViewComponent, "gz-callout-node-view", never, {}, {}, never, never, true, never>;
}
