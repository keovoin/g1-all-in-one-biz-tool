import { EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { LocalDataSource, Settings } from 'angular2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { IDocument } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocsRowActionsService } from '../actions/docs-row-actions.service';
import { DocumentPermissionService } from '../../services/document-permission.service';
import { DocsTableColumnKey } from './docs-table-columns.model';
import * as i0 from "@angular/core";
/**
 * Server-paginated documents table (`angular2-smart-table`, external mode —
 * pagination renders outside via the shared `ga-pagination`). Column set and
 * renderers per `04-frontend-plugin.md` §4.3.
 */
export declare class DocsTableComponent extends TranslationBaseComponent implements OnInit, OnChanges, OnDestroy {
    readonly translateService: TranslateService;
    private readonly rowActions;
    private readonly documentPermission;
    private readonly nbMenuService;
    private readonly permissionsService;
    /**
     * How long a single click waits to see whether it is really the first half of a double click.
     * Comfortably inside the platform double-click threshold, and short enough that opening the detail
     * panel still feels immediate.
     */
    private static readonly DOUBLE_CLICK_GRACE_MS;
    private pendingRowOpen;
    rows: IDocument[];
    loading: boolean;
    /** Renders selection checkboxes (DOCS_MANAGE — plus DOCS_REVIEW on the review queue). */
    selectable: boolean;
    /** Reduced column set for the review queue. */
    reviewMode: boolean;
    rowClicked: EventEmitter<IDocument>;
    folderOpened: EventEmitter<IDocument>;
    selectionChanged: EventEmitter<string[]>;
    sortChanged: EventEmitter<{
        field: string;
        order: "ASC" | "DESC";
    }>;
    retryRequested: EventEmitter<IDocument>;
    /** Double-click on a FILE row — the browse page opens `gz-docs-preview-modal`. */
    previewRequested: EventEmitter<IDocument>;
    /** Double-click on a PAGE row — opens the editor route. */
    editorRequested: EventEmitter<IDocument>;
    /**
     * `angular2-smart-table` types `[settings]` as `Settings`, whose `columns` is
     * required — a bare `Record<string, unknown>` fails the AOT template check
     * even though it works at runtime. Seeded with empty columns so the binding
     * is valid before `buildSettings()` runs.
     */
    settings: Settings;
    source: LocalDataSource;
    /** Columns the chooser offers (everything except the always-on Name column). */
    readonly selectableColumns: DocsTableColumnKey[];
    /** Effective visibility — stored preference over the narrow-viewport defaults. */
    columnVisibility: Record<DocsTableColumnKey, boolean>;
    /** Only the columns the user explicitly toggled; the rest follow the defaults. */
    private columnPreferences;
    /** Last evaluated breakpoint state — a resize only rebuilds when it flips. */
    private narrowViewport;
    /** Permission flags backing the row kebab (`01-ux-spec.md` §3.5 is permission-filtered). */
    private permissions;
    constructor(translateService: TranslateService, rowActions: DocsRowActionsService, documentPermission: DocumentPermissionService, nbMenuService: NbMenuService, permissionsService: NgxPermissionsService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * The `< lg` defaults only apply while the viewport is actually narrow, so the
     * breakpoint is re-evaluated on resize — but the settings object is rebuilt only
     * when the flag flips, never on every resize frame.
     */
    onWindowResize(): void;
    isColumnVisible(column: DocsTableColumnKey): boolean;
    columnTitleKey(column: DocsTableColumnKey): string;
    /** Persists the choice as an explicit preference — it outranks the breakpoint defaults. */
    toggleColumn(column: DocsTableColumnKey, visible: boolean): void;
    private resolveColumns;
    /**
     * SELECTION ONLY — opening a row is `onRowClick`'s job.
     *
     * This used to open the detail panel too, which meant the panel was unreachable by row click for
     * exactly the users most likely to want it. `angular2-smart-table` only emits `userRowSelect` for a
     * row-BODY click when `selectMode === 'single'` (`onUserSelectRow` early-returns otherwise), and
     * `buildSettings()` runs this grid in `'multi'` whenever `selectable` is on — i.e. for anyone with
     * DOCS_MANAGE. So an admin clicking a document row got nothing at all.
     *
     * The mirror-image defect: `onMultipleSelectRow` DOES emit it, so ticking a checkbox for a bulk
     * action also opened the detail panel. Both go away by making this handler do one thing.
     */
    onUserRowSelect(event: {
        data?: IDocument | null;
        selected?: IDocument[];
    }): void;
    /**
     * Single-click row open (`01-ux-spec.md` §4.1): folders drill in, everything else opens the detail
     * panel. Handled on the container for the reason above — the grid's own output is not delivered in
     * multi-select mode.
     */
    protected onRowClick(event: MouseEvent): void;
    /**
     * Keyboard equivalent of `onRowClick`. The grid renders plain `<tr>`s with no interactive role, so
     * a pointer-only open left the detail panel unreachable without a mouse; Enter/Space on anything
     * focusable inside a row (its kebab aside, which owns its own keys) now opens that row.
     */
    protected onRowKeydown(event: KeyboardEvent): void;
    /**
     * Per-kind default open on double click (`01-ux-spec.md` §4.1) — folder drill,
     * page editor, file preview.
     */
    onRowDoubleClick(event: MouseEvent): void;
    /**
     * True when the event came from a control that owns its own behaviour: the multi-select cell (which
     * selects, and must never also open), the row kebab, the status Retry button, and the sortable
     * column headers' anchors.
     */
    private isControlEvent;
    /**
     * DOM index of the clicked DATA row, or undefined when the click was not on one.
     *
     * `angular2-smart-table` exposes no click/dblclick output carrying the row, so position is all we
     * have. Restricted to `<tbody>` on purpose: the header and filter rows are `<tr>`s too, and a click
     * on a column header's padding (outside its sort anchor) would otherwise resolve to index 0 and
     * open the first document. Expanded detail rows are skipped so they cannot shift the mapping.
     */
    private resolveRowIndex;
    /**
     * Resolves a rendered row index to its document.
     *
     * Indexed against what the grid actually RENDERS, not the `rows` input: `LocalDataSource` applies
     * its own sort and paging, so after a sort the DOM order no longer matches the array it was loaded
     * from and an index into `rows` would open a different document than the one clicked.
     */
    private resolveRowAt;
    private cancelPendingRowOpen;
    ngOnDestroy(): void;
    private menuContext;
    /**
     * Routes one kebab click.
     *
     * The three **view** actions stay with the table because only the hosting page
     * knows what "open" means here (the preview modal, the editor route, the detail
     * panel) — they reuse the outputs the double-click handler already emits.
     * Everything else is the shared executor, so a rename from the table behaves
     * exactly like a rename from the tree.
     */
    private onRowAction;
    private _applyTranslationOnSmartTable;
    private buildSettings;
    private humanizeSize;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsTableComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsTableComponent, "gz-docs-table", never, { "rows": { "alias": "rows"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "selectable": { "alias": "selectable"; "required": false; }; "reviewMode": { "alias": "reviewMode"; "required": false; }; }, { "rowClicked": "rowClicked"; "folderOpened": "folderOpened"; "selectionChanged": "selectionChanged"; "sortChanged": "sortChanged"; "retryRequested": "retryRequested"; "previewRequested": "previewRequested"; "editorRequested": "editorRequested"; }, never, never, false, never>;
}
