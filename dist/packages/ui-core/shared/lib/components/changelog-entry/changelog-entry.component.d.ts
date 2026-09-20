import { IChangelog } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * One "What's New" card. Shared by the changelog sidebar and the login page
 * panel so the two surfaces cannot drift apart. Entries carrying a
 * learnMoreUrl render as whole-card links opening in a new tab; without one
 * the anchor has no href, so it stays inert (not focusable, not clickable).
 *
 * Spacing between cards is the parent's concern (see `@shared/_whats-new`):
 * the host only sizes itself, so the login panel and the sidebar can keep
 * their different bottom margins.
 */
export declare class ChangelogEntryComponent {
    entry: IChangelog;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChangelogEntryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChangelogEntryComponent, "ngx-changelog-entry", never, { "entry": { "alias": "entry"; "required": true; }; }, {}, never, never, true, never>;
}
