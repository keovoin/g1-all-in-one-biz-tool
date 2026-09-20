import { EventEmitter, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { DocumentKindEnum, ID, IDocument } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocsRowActionsService } from '../actions/docs-row-actions.service';
import { DocumentPermissionService } from '../../services/document-permission.service';
import * as i0 from "@angular/core";
/**
 * Breadcrumb segment of the current tree location ("All documents / Finance / Invoices").
 *
 * Rendered by the **browse page header**, not by this component: both layouts and
 * the empty-folder state need it, and only the header sits outside the
 * `rows.length` switch (`00-product-spec.md` §6.9 R-TRE-01). The type stays here
 * because the cards view is where the crumb row originated.
 *
 * 🛑 `id` is nullable and `restricted` marks an ancestor the caller may not read
 * (`08-permissions-security.md` §3.2) — such a segment renders as
 * `DOCS.BREADCRUMB.RESTRICTED` and must NOT be clickable.
 */
export interface IDocsCardsCrumb {
    id: ID | null;
    name: string;
    restricted?: boolean;
}
/** List rows carry `childrenCount`/`hasChildren` (backend list projection). */
type DocsCardRow = IDocument & {
    childrenCount?: number;
    isArchived?: boolean;
};
/**
 * Cards view (`01-ux-spec.md` §4.2): folder cards first (icon/color, name,
 * child count, drill-in), then document cards (kind/mime icon, name, badge
 * row, category chips, updated + size footer). A breadcrumb row above the
 * grid tracks the current tree location; "Load more" appends the next batch.
 * With an active search/preset/facet the grid flattens (no folder cards) and
 * shows the `DOCS.CARDS.FLAT_RESULTS_HINT` bar.
 */
export declare class DocsCardsComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly rowActions;
    private readonly documentPermission;
    private readonly nbMenuService;
    private readonly permissionsService;
    rows: DocsCardRow[];
    totalCount: number;
    loading: boolean;
    /** Flat results mode: search or a non-All preset active — folder cards hidden. */
    flat: boolean;
    /**
     * Ancestor chain of the current tree location; empty = root.
     *
     * The grid no longer renders it — the browse page header does, so the crumbs
     * survive the table layout and an empty folder. Kept as an input (with
     * {@link onCrumbClick}) so an embedder that renders the grid on its own can
     * still drive `drillIn` from a crumb.
     */
    breadcrumb: IDocsCardsCrumb[];
    /** Card whose detail panel is open gets `active` styling. */
    activeId: ID | null;
    constructor(translateService: TranslateService, rowActions: DocsRowActionsService, documentPermission: DocumentPermissionService, nbMenuService: NbMenuService, permissionsService: NgxPermissionsService);
    ngOnInit(): void;
    menuTag(row: DocsCardRow): string;
    /**
     * The card's action menu, from the shared builder.
     *
     * 🛑 Memoized on everything the item set is derived from: this is called from a
     * template binding, and `[nbContextMenu]` rebuilds its overlay whenever the
     * bound array is a new reference.
     */
    menuItemsFor(row: DocsCardRow): NbMenuItem[];
    private menuContext;
    /**
     * The view actions stay with the grid — "open" on a card means what the card
     * already does on double click — and everything else goes to the shared
     * executor, so a card action behaves exactly like the same action in the table.
     */
    private onCardAction;
    /** Card body click — opens the detail panel (`01-ux-spec.md` §4.2). */
    open: EventEmitter<IDocument>;
    /** FILE card preview affordance — the browse page opens `gz-docs-preview-modal`. */
    preview: EventEmitter<IDocument>;
    /** PAGE card open-in-editor affordance. */
    openEditor: EventEmitter<IDocument>;
    /** Folder card click — sets the tree location (`?folder=`); `null` = root crumb. */
    drillIn: EventEmitter<string>;
    loadMore: EventEmitter<void>;
    readonly kindEnum: typeof DocumentKindEnum;
    /**
     * Documents whose thumbnail failed to load — a signed provider URL that expired between
     * the list response and the `<img>` fetch, or a thumbnail deleted from storage. Recorded
     * per card so the row falls back to its kind icon instead of rendering a broken image.
     */
    private readonly failedThumbnails;
    /** Permission flags backing the card kebab (the item set is permission-filtered). */
    private permissions;
    /** documentId → last built menu, keyed by the signature it was built from. */
    private readonly menuCache;
    get folderCards(): DocsCardRow[];
    get documentCards(): DocsCardRow[];
    get hasMore(): boolean;
    onCardClick(row: DocsCardRow): void;
    /** Crumb → drill-in. A redacted segment has no id to drill into and is ignored. */
    onCrumbClick(crumb: IDocsCardsCrumb): void;
    /** Per-kind default open (card kebab / double click), mirroring the table. */
    onDefaultOpen(row: DocsCardRow, event?: Event): void;
    isActive(row: DocsCardRow): boolean;
    kindIcon(row: DocsCardRow): string;
    /**
     * The card's preview image, or `null` when it must fall back to the kind icon.
     *
     * `thumbUrl` is a **virtual** column the backend resolves from `storageProvider` +
     * `thumbKey` (`document.subscriber.ts`), so it is absent until the P1 thumbnail job has
     * run — most rows will never have one, and every row must look finished without it.
     *
     * 🛑 The URL is provider-supplied and goes straight into `<img [src]>`, so it goes through
     * the app's scheme allowlist first. Angular's own URL check is a denylist of exactly one
     * scheme (see `editor/read-only/safe-url.util.ts`), which would let a stored
     * `data:text/html` or `vbscript:` value through untouched.
     */
    thumbnailUrl(row: DocsCardRow): string | null;
    /** A thumbnail that 404s or expires degrades to the kind icon rather than a broken image. */
    onThumbnailError(row: DocsCardRow): void;
    humanizeSize(bytes?: number): string;
    trackById(_: number, row: DocsCardRow): string;
    private fileIcon;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsCardsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsCardsComponent, "gz-docs-cards", never, { "rows": { "alias": "rows"; "required": false; }; "totalCount": { "alias": "totalCount"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "flat": { "alias": "flat"; "required": false; }; "breadcrumb": { "alias": "breadcrumb"; "required": false; }; "activeId": { "alias": "activeId"; "required": false; }; }, { "open": "open"; "preview": "preview"; "openEditor": "openEditor"; "drillIn": "drillIn"; "loadMore": "loadMore"; }, never, never, false, never>;
}
export {};
