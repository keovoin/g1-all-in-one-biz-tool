import { NbMenuItem } from '@nebular/theme';
import { IDocument } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Actions column renderer (`01-ux-spec.md` §4.1, column 9): a kebab opening the
 * same action set as the tree context menu, plus Details and (for a FILE)
 * Preview.
 *
 * The cell renders only — the items are built by `DocsTableComponent` from the
 * shared `buildDocsActionMenu()`, and clicks come back through the table's own
 * `NbMenuService` subscription (one subscription for the page, keyed by the tag
 * prefix, rather than one per rendered row).
 */
export declare class RowActionsComponent {
    rowData: IDocument;
    /** Prebuilt, permission-filtered items (see `docs-action-menu.ts`). */
    menuItems: NbMenuItem[];
    /** `<prefix><documentId>` — the table resolves the row from it. */
    tag: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<RowActionsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RowActionsComponent, "gz-docs-row-actions", never, { "rowData": { "alias": "rowData"; "required": false; }; "menuItems": { "alias": "menuItems"; "required": false; }; "tag": { "alias": "tag"; "required": false; }; }, {}, never, never, false, never>;
}
