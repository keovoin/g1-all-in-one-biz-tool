import { AngularNodeViewComponent } from '../node-view/angular-node-view-renderer';
import * as i0 from "@angular/core";
/**
 * Node view for `embedCard` (spec 05 §6.2): render-only bookmark card — generic
 * globe icon + domain (no external favicon fetch in v1), title (or URL) and an
 * open-in-new-tab affordance.
 */
export declare class EmbedCardNodeViewComponent extends AngularNodeViewComponent {
    get url(): string;
    get title(): string;
    get description(): string | null;
    get domain(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmbedCardNodeViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmbedCardNodeViewComponent, "gz-embed-card-node-view", never, {}, {}, never, never, true, never>;
}
