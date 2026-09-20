var DocsTableComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { LocalDataSource } from 'angular2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxPermissionsService } from 'ngx-permissions';
import { filter } from 'rxjs/operators';
import { DocumentKindEnum, PermissionsEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { buildDocsActionMenu, docsActionOf, toDocsActionTarget } from '../actions/docs-action-menu';
import { DocsRowActionsService } from '../actions/docs-row-actions.service';
import { DocumentPermissionService } from '../../services/document-permission.service';
import { RowActionsComponent } from './cells/row-actions.component';
import { DOCS_TABLE_COLUMN_KEYS, DOCS_TABLE_COLUMN_TITLE_KEYS, DOCS_TABLE_REQUIRED_COLUMNS, isNarrowViewport, readDocsTableColumnPreferences, resolveDocsTableColumns, writeDocsTableColumnPreferences } from './docs-table-columns.model';
import { CategoryChipsComponent } from './cells/category-chips.component';
import { KnowledgeBadgeComponent } from './cells/knowledge-badge.component';
import { NameCellComponent } from './cells/name-cell.component';
import { SourceBadgeComponent } from './cells/source-badge.component';
import { StatusBadgeComponent } from './cells/status-badge.component';
import { TagChipsComponent } from './cells/tag-chips.component';
import { UpdatedCellComponent } from './cells/updated-cell.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../actions/docs-row-actions.service";
import * as i3 from "../../services/document-permission.service";
import * as i4 from "@nebular/theme";
import * as i5 from "ngx-permissions";
import * as i6 from "@angular/common";
import * as i7 from "angular2-smart-table";
import * as i8 from "@gauzy/ui-core/shared";
/** Nebular menu-tag prefix for the per-row kebab; the suffix is the document id. */
const ROW_MENU_TAG_PREFIX = 'gz-docs-row-actions-';
/**
 * Server-paginated documents table (`angular2-smart-table`, external mode —
 * pagination renders outside via the shared `ga-pagination`). Column set and
 * renderers per `04-frontend-plugin.md` §4.3.
 */
let DocsTableComponent = class DocsTableComponent extends TranslationBaseComponent {
    static { DocsTableComponent_1 = this; }
    /**
     * How long a single click waits to see whether it is really the first half of a double click.
     * Comfortably inside the platform double-click threshold, and short enough that opening the detail
     * panel still feels immediate.
     */
    static { this.DOUBLE_CLICK_GRACE_MS = 250; }
    constructor(translateService, rowActions, documentPermission, nbMenuService, permissionsService) {
        super(translateService);
        this.translateService = translateService;
        this.rowActions = rowActions;
        this.documentPermission = documentPermission;
        this.nbMenuService = nbMenuService;
        this.permissionsService = permissionsService;
        this.pendingRowOpen = null;
        this.rows = [];
        this.loading = false;
        /** Renders selection checkboxes (DOCS_MANAGE — plus DOCS_REVIEW on the review queue). */
        this.selectable = false;
        /** Reduced column set for the review queue. */
        this.reviewMode = false;
        this.rowClicked = new EventEmitter();
        this.folderOpened = new EventEmitter();
        this.selectionChanged = new EventEmitter();
        this.sortChanged = new EventEmitter();
        this.retryRequested = new EventEmitter();
        /** Double-click on a FILE row — the browse page opens `gz-docs-preview-modal`. */
        this.previewRequested = new EventEmitter();
        /** Double-click on a PAGE row — opens the editor route. */
        this.editorRequested = new EventEmitter();
        /**
         * `angular2-smart-table` types `[settings]` as `Settings`, whose `columns` is
         * required — a bare `Record<string, unknown>` fails the AOT template check
         * even though it works at runtime. Seeded with empty columns so the binding
         * is valid before `buildSettings()` runs.
         */
        this.settings = { columns: {} };
        this.source = new LocalDataSource();
        /** Columns the chooser offers (everything except the always-on Name column). */
        this.selectableColumns = DOCS_TABLE_COLUMN_KEYS.filter((key) => !DOCS_TABLE_REQUIRED_COLUMNS.includes(key));
        /** Effective visibility — stored preference over the narrow-viewport defaults. */
        this.columnVisibility = resolveDocsTableColumns({}, false);
        /** Only the columns the user explicitly toggled; the rest follow the defaults. */
        this.columnPreferences = {};
        /** Last evaluated breakpoint state — a resize only rebuilds when it flips. */
        this.narrowViewport = false;
        /** Permission flags backing the row kebab (`01-ux-spec.md` §3.5 is permission-filtered). */
        this.permissions = { create: false, update: false, delete: false, aiImport: false };
    }
    ngOnInit() {
        this.columnPreferences = readDocsTableColumnPreferences();
        this.narrowViewport = isNarrowViewport();
        this.resolveColumns();
        this.buildSettings();
        this._applyTranslationOnSmartTable();
        // The kebab items are permission-filtered, and a star toggled anywhere flips
        // the Favorite/Unfavorite label — both rebuild the rendered menus.
        this.permissionsService.permissions$.pipe(untilDestroyed(this)).subscribe((permissions) => {
            this.permissions = {
                create: !!permissions[PermissionsEnum.DOCS_CREATE],
                update: !!permissions[PermissionsEnum.DOCS_UPDATE],
                delete: !!permissions[PermissionsEnum.DOCS_DELETE],
                aiImport: !!permissions[PermissionsEnum.DOCS_AI_IMPORT]
            };
            this.buildSettings();
        });
        this.rowActions.favoriteIds$.pipe(untilDestroyed(this)).subscribe(() => this.buildSettings());
        // ONE subscription for the whole table: the clicked row is carried by the
        // menu tag, so a per-row subscription (25 of them on a default page) is not
        // needed — the tree resolves its context menu the same way.
        this.nbMenuService
            .onItemClick()
            .pipe(filter(({ tag }) => (tag ?? '').startsWith(ROW_MENU_TAG_PREFIX)), untilDestroyed(this))
            .subscribe(({ tag, item }) => {
            const id = tag.slice(ROW_MENU_TAG_PREFIX.length);
            // A menu click cannot be awaited; `execute()` owns its failure path.
            void this.onRowAction(docsActionOf(item), id);
        });
        this.source.onChanged().pipe(untilDestroyed(this)).subscribe((change) => {
            if (change?.action === 'sort' && change.sort?.length) {
                const [sort] = change.sort;
                this.sortChanged.emit({
                    field: sort.field,
                    order: sort.direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
                });
            }
        });
    }
    ngOnChanges(changes) {
        if (changes['rows']) {
            void this.source.load(this.rows ?? []);
        }
        if (changes['selectable'] || changes['reviewMode']) {
            this.buildSettings();
        }
    }
    /**
     * The `< lg` defaults only apply while the viewport is actually narrow, so the
     * breakpoint is re-evaluated on resize — but the settings object is rebuilt only
     * when the flag flips, never on every resize frame.
     */
    onWindowResize() {
        const narrow = isNarrowViewport();
        if (narrow === this.narrowViewport)
            return;
        this.narrowViewport = narrow;
        this.resolveColumns();
        this.buildSettings();
    }
    // ─── Column chooser (`01-ux-spec.md` §4.1) ───────────────────
    isColumnVisible(column) {
        return this.columnVisibility[column] !== false;
    }
    columnTitleKey(column) {
        return DOCS_TABLE_COLUMN_TITLE_KEYS[column];
    }
    /** Persists the choice as an explicit preference — it outranks the breakpoint defaults. */
    toggleColumn(column, visible) {
        if (DOCS_TABLE_REQUIRED_COLUMNS.includes(column))
            return;
        this.columnPreferences = { ...this.columnPreferences, [column]: visible };
        writeDocsTableColumnPreferences(this.columnPreferences);
        this.resolveColumns();
        this.buildSettings();
    }
    resolveColumns() {
        this.columnVisibility = resolveDocsTableColumns(this.columnPreferences, this.narrowViewport);
    }
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
    onUserRowSelect(event) {
        // Only a selectable table has a selection to report. `createRowSelectionEvent` ALWAYS attaches
        // `selected`, and in single-select mode (which is what `selectable: false` configures) a plain
        // row-body click emits it — so without this gate, opening a row on a table that renders no
        // checkboxes would still drive the parent's bulk-selection state.
        if (this.selectable && event?.selected) {
            this.selectionChanged.emit(event.selected.map((row) => row.id));
        }
    }
    /**
     * Single-click row open (`01-ux-spec.md` §4.1): folders drill in, everything else opens the detail
     * panel. Handled on the container for the reason above — the grid's own output is not delivered in
     * multi-select mode.
     */
    onRowClick(event) {
        if (this.isControlEvent(event))
            return;
        // The second click of a double click must not schedule its own open — `detail` is the click
        // count, so this leaves exactly one pending action for `onRowDoubleClick` to cancel.
        if (event.detail > 1)
            return;
        const index = this.resolveRowIndex(event);
        if (index === undefined)
            return;
        // A double click delivers two `click` events BEFORE `dblclick`, so acting immediately would open
        // the detail panel on the way to the editor/preview — and drill a folder TWICE, since both
        // handlers emit `folderOpened`. Defer past the double-click window; `onRowDoubleClick` cancels.
        this.cancelPendingRowOpen();
        this.pendingRowOpen = setTimeout(() => {
            this.pendingRowOpen = null;
            void this.resolveRowAt(index).then((data) => {
                if (!data)
                    return;
                if (data.kind === DocumentKindEnum.FOLDER) {
                    this.folderOpened.emit(data);
                }
                else {
                    this.rowClicked.emit(data);
                }
            });
        }, DocsTableComponent_1.DOUBLE_CLICK_GRACE_MS);
    }
    /**
     * Keyboard equivalent of `onRowClick`. The grid renders plain `<tr>`s with no interactive role, so
     * a pointer-only open left the detail panel unreachable without a mouse; Enter/Space on anything
     * focusable inside a row (its kebab aside, which owns its own keys) now opens that row.
     */
    onRowKeydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ')
            return;
        if (this.isControlEvent(event))
            return;
        const index = this.resolveRowIndex(event);
        if (index === undefined)
            return;
        // Space would otherwise scroll the table out from under the panel that is about to open.
        event.preventDefault();
        this.cancelPendingRowOpen();
        void this.resolveRowAt(index).then((data) => {
            if (!data)
                return;
            if (data.kind === DocumentKindEnum.FOLDER) {
                this.folderOpened.emit(data);
            }
            else {
                this.rowClicked.emit(data);
            }
        });
    }
    /**
     * Per-kind default open on double click (`01-ux-spec.md` §4.1) — folder drill,
     * page editor, file preview.
     */
    onRowDoubleClick(event) {
        this.cancelPendingRowOpen();
        // Child controls stop `click` propagation but not `dblclick`, so this handler sees bubbled
        // double clicks from the kebab, the Retry button and the select checkbox. Same guard as the
        // single-click path, or double-clicking any of them would open the row behind it.
        if (this.isControlEvent(event))
            return;
        const index = this.resolveRowIndex(event);
        if (index === undefined)
            return;
        void this.resolveRowAt(index).then((data) => {
            if (!data)
                return;
            switch (data.kind) {
                case DocumentKindEnum.FOLDER:
                    this.folderOpened.emit(data);
                    break;
                case DocumentKindEnum.PAGE:
                    this.editorRequested.emit(data);
                    break;
                default:
                    this.previewRequested.emit(data);
            }
        });
    }
    /**
     * True when the event came from a control that owns its own behaviour: the multi-select cell (which
     * selects, and must never also open), the row kebab, the status Retry button, and the sortable
     * column headers' anchors.
     */
    isControlEvent(event) {
        const target = event.target;
        return !!target?.closest?.('.angular2-smart-action-multiple-select, button, a, input, nb-checkbox');
    }
    /**
     * DOM index of the clicked DATA row, or undefined when the click was not on one.
     *
     * `angular2-smart-table` exposes no click/dblclick output carrying the row, so position is all we
     * have. Restricted to `<tbody>` on purpose: the header and filter rows are `<tr>`s too, and a click
     * on a column header's padding (outside its sort anchor) would otherwise resolve to index 0 and
     * open the first document. Expanded detail rows are skipped so they cannot shift the mapping.
     */
    resolveRowIndex(event) {
        const row = event.target?.closest?.('tr');
        const body = row?.parentElement;
        if (!row || body?.tagName !== 'TBODY')
            return undefined;
        const dataRows = Array.from(body.children).filter((el) => el.tagName === 'TR' && !el.classList.contains('angular2-smart-row-detail'));
        const index = dataRows.indexOf(row);
        return index >= 0 ? index : undefined;
    }
    /**
     * Resolves a rendered row index to its document.
     *
     * Indexed against what the grid actually RENDERS, not the `rows` input: `LocalDataSource` applies
     * its own sort and paging, so after a sort the DOM order no longer matches the array it was loaded
     * from and an index into `rows` would open a different document than the one clicked.
     */
    async resolveRowAt(index) {
        const rendered = (await this.source.getElements().catch(() => []));
        return rendered?.[index] ?? this.rows?.[index];
    }
    cancelPendingRowOpen() {
        if (this.pendingRowOpen) {
            clearTimeout(this.pendingRowOpen);
            this.pendingRowOpen = null;
        }
    }
    ngOnDestroy() {
        this.cancelPendingRowOpen();
    }
    // ─── Row actions (`01-ux-spec.md` §4.1 column 9) ─────────────
    menuContext(row) {
        return {
            surface: 'row',
            translate: (key) => this.getTranslation(key),
            isFavorite: this.rowActions.isFavorite(row?.id),
            // Ownership half of the write rule (spec 08 §1.7). `createdByUserId` and
            // `visibility` are both in the list projection, so the row already carries it.
            canMutate: this.documentPermission.canMutate(row),
            permissions: this.permissions
        };
    }
    /**
     * Routes one kebab click.
     *
     * The three **view** actions stay with the table because only the hosting page
     * knows what "open" means here (the preview modal, the editor route, the detail
     * panel) — they reuse the outputs the double-click handler already emits.
     * Everything else is the shared executor, so a rename from the table behaves
     * exactly like a rename from the tree.
     */
    async onRowAction(action, id) {
        const row = (this.rows ?? []).find((candidate) => String(candidate.id) === id);
        if (!row || !action)
            return;
        switch (action) {
            case 'details':
                this.rowClicked.emit(row);
                return;
            case 'preview':
                this.previewRequested.emit(row);
                return;
            case 'open':
                if (row.kind === DocumentKindEnum.FOLDER)
                    this.folderOpened.emit(row);
                else if (row.kind === DocumentKindEnum.PAGE)
                    this.editorRequested.emit(row);
                else
                    this.previewRequested.emit(row);
                return;
            default:
                await this.rowActions.execute(action, toDocsActionTarget(row));
        }
    }
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange.pipe(untilDestroyed(this)).subscribe(() => this.buildSettings());
    }
    buildSettings() {
        const columns = {
            name: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['name']),
                type: 'custom',
                isSortable: true,
                isFilterable: false,
                renderComponent: NameCellComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                    instance.value = cell.getValue();
                }
            },
            categories: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['categories']),
                type: 'custom',
                isSortable: false,
                isFilterable: false,
                renderComponent: CategoryChipsComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                }
            },
            tags: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['tags']),
                type: 'custom',
                isSortable: false,
                isFilterable: false,
                renderComponent: TagChipsComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                }
            },
            status: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['status']),
                type: 'custom',
                isSortable: false,
                isFilterable: false,
                renderComponent: StatusBadgeComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                    instance.retryHandler = (document) => this.retryRequested.emit(document);
                }
            },
            knowledge: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['knowledge']),
                type: 'custom',
                isSortable: false,
                isFilterable: false,
                renderComponent: KnowledgeBadgeComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                }
            },
            source: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['source']),
                type: 'custom',
                isSortable: true,
                isFilterable: false,
                renderComponent: SourceBadgeComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                }
            },
            fileSize: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['fileSize']),
                type: 'text',
                isSortable: true,
                isFilterable: false,
                valuePrepareFunction: (value) => this.humanizeSize(value)
            },
            updatedAt: {
                title: this.getTranslation(DOCS_TABLE_COLUMN_TITLE_KEYS['updatedAt']),
                type: 'custom',
                isSortable: true,
                isFilterable: false,
                renderComponent: UpdatedCellComponent,
                componentInitFunction: (instance, cell) => {
                    instance.rowData = cell.getRow().getData();
                    instance.value = cell.getValue();
                }
            },
            // Column 9 (`01-ux-spec.md` §4.1): the row kebab, carrying the same action
            // set as the tree context menu plus Details and (FILE) Preview. It is
            // deliberately NOT part of the column chooser — it is the only way to reach
            // most per-row actions, so hiding it would strand them, which is why
            // `docs-table-columns.model.ts` leaves it out of `DOCS_TABLE_COLUMN_KEYS`.
            actions: {
                title: this.getTranslation('DOCS.TABLE.COLUMNS.ACTIONS'),
                type: 'custom',
                isSortable: false,
                isFilterable: false,
                renderComponent: RowActionsComponent,
                componentInitFunction: (instance, cell) => {
                    const row = cell.getRow().getData();
                    instance.rowData = row;
                    instance.tag = `${ROW_MENU_TAG_PREFIX}${row?.id}`;
                    instance.menuItems = buildDocsActionMenu(toDocsActionTarget(row), this.menuContext(row));
                }
            }
        };
        if (this.reviewMode) {
            delete columns['status'];
            delete columns['knowledge'];
            delete columns['fileSize'];
            delete columns['tags'];
        }
        else {
            // Column chooser + `< lg` defaults. The review queue keeps its own fixed
            // reduced set — a reviewer's columns are the task, not a preference.
            for (const key of DOCS_TABLE_COLUMN_KEYS) {
                if (!this.isColumnVisible(key))
                    delete columns[key];
            }
        }
        this.settings = {
            selectMode: this.selectable ? 'multi' : 'single',
            actions: false,
            mode: 'external',
            hideSubHeader: true,
            pager: { display: false },
            noDataMessage: this.getTranslation('DOCS.TABLE.NO_DATA'),
            // The column map is assembled as a plain record above (entries are
            // deleted for the reduced review-queue set); assert it at the boundary.
            columns: columns
        };
    }
    humanizeSize(bytes) {
        if (!bytes || bytes <= 0)
            return '';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsTableComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocsRowActionsService }, { token: i3.DocumentPermissionService }, { token: i4.NbMenuService }, { token: i5.NgxPermissionsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsTableComponent, isStandalone: false, selector: "gz-docs-table", inputs: { rows: "rows", loading: "loading", selectable: "selectable", reviewMode: "reviewMode" }, outputs: { rowClicked: "rowClicked", folderOpened: "folderOpened", selectionChanged: "selectionChanged", sortChanged: "sortChanged", retryRequested: "retryRequested", previewRequested: "previewRequested", editorRequested: "editorRequested" }, host: { listeners: { "window:resize": "onWindowResize()" } }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div\n\tclass=\"docs-table\"\n\t[nbSpinner]=\"loading\"\n\tnbSpinnerStatus=\"primary\"\n\tnbSpinnerSize=\"large\"\n\t(click)=\"onRowClick($event)\"\n\t(keydown)=\"onRowKeydown($event)\"\n\t(dblclick)=\"onRowDoubleClick($event)\"\n>\n\t<!-- Column chooser \u2014 header kebab, persisted to localStorage['gauzy_docs_columns'] -->\n\t<div class=\"docs-table-toolbar\" *ngIf=\"!reviewMode\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"tiny\"\n\t\t\tclass=\"docs-column-chooser-toggle\"\n\t\t\t[nbPopover]=\"columnChooser\"\n\t\t\tnbPopoverTrigger=\"click\"\n\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t[nbTooltip]=\"'DOCS.TABLE.COLUMN_CHOOSER' | translate\"\n\t\t\t[attr.aria-label]=\"'DOCS.TABLE.COLUMN_CHOOSER' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"more-vertical-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\n\t<angular2-smart-table\n\t\t[settings]=\"settings\"\n\t\t[source]=\"source\"\n\t\t(userRowSelect)=\"onUserRowSelect($event)\"\n\t\tstyle=\"cursor: pointer\"\n\t></angular2-smart-table>\n</div>\n\n<ng-template #columnChooser>\n\t<nb-card class=\"docs-column-chooser\">\n\t\t<nb-card-header>{{ 'DOCS.TABLE.COLUMN_CHOOSER' | translate }}</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<nb-checkbox\n\t\t\t\t*ngFor=\"let column of selectableColumns\"\n\t\t\t\t[checked]=\"isColumnVisible(column)\"\n\t\t\t\t(checkedChange)=\"toggleColumn(column, $event)\"\n\t\t\t>\n\t\t\t\t{{ columnTitleKey(column) | translate }}\n\t\t\t</nb-checkbox>\n\t\t</nb-card-body>\n\t</nb-card>\n</ng-template>\n", styles: [":host{display:block;min-width:0}.docs-table{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;--gauzy-table-chip-block-gap: .1875rem;--docs-updated-cell-width: 9.5rem;min-height:12rem;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18));overflow:hidden}.docs-table ::ng-deep table{width:100%;border-collapse:collapse}.docs-table-toolbar{display:flex;justify-content:flex-end;align-items:center;min-height:2rem;padding:.25rem .375rem 0}.docs-table-toolbar .docs-column-chooser-toggle{display:inline-flex;align-items:center;justify-content:center;width:var(--docs-control-height-sm, 1.75rem);height:var(--docs-control-height-sm, 1.75rem);padding:0;border-radius:var(--docs-radius, .375rem)}.docs-table-toolbar .docs-column-chooser-toggle nb-icon{margin:0;font-size:1rem}.docs-table ::ng-deep tr.angular2-smart-titles>th{border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));vertical-align:middle;white-space:nowrap}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail){background:transparent;border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail):last-child{border-bottom:0}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail):hover{background:var(--docs-hover, rgba(126, 126, 143, .12))!important}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail)>td{vertical-align:middle}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail)>td:last-child{width:3rem;text-align:right;white-space:nowrap}.docs-table ::ng-deep tr.angular2-smart-titles>th:not(.angular2-smart-th),.docs-table ::ng-deep td.angular2-smart-action-multiple-select{width:2.5rem;min-width:2.5rem;padding-inline:.5rem;text-align:center;vertical-align:middle}.docs-table ::ng-deep tr.angular2-smart-titles>th input[type=checkbox],.docs-table ::ng-deep td.angular2-smart-action-multiple-select input[type=checkbox]{display:inline-block;width:.875rem;height:.875rem;margin:0;vertical-align:middle;accent-color:var(--color-primary-default);cursor:pointer;border:none!important;outline:none!important;box-shadow:none!important}.docs-table ::ng-deep tr.angular2-smart-titles>th input[type=checkbox]:focus-visible,.docs-table ::ng-deep td.angular2-smart-action-multiple-select input[type=checkbox]:focus-visible{outline:2px solid var(--color-primary-default)!important;outline-offset:2px}.docs-table ::ng-deep th.angular2-smart-th.name{width:26%;min-width:11rem}.docs-table ::ng-deep th.angular2-smart-th.categories,.docs-table ::ng-deep th.angular2-smart-th.tags{width:12%}.docs-table ::ng-deep th.angular2-smart-th.status,.docs-table ::ng-deep th.angular2-smart-th.knowledge,.docs-table ::ng-deep th.angular2-smart-th.source{width:9%}.docs-table ::ng-deep th.angular2-smart-th.fileSize{width:5.5rem}.docs-table ::ng-deep th.angular2-smart-th.updatedAt{width:calc(var(--docs-updated-cell-width, 9.5rem) + .875rem);white-space:nowrap}.docs-table ::ng-deep th.angular2-smart-th.actions{width:3rem}.docs-table ::ng-deep td{min-width:0}.docs-table ::ng-deep td nb-icon{font-size:.8125rem}.docs-table ::ng-deep td .docs-name-text{font-size:inherit;font-weight:500}.docs-table ::ng-deep td .docs-name-lead{width:1.125rem;height:1.125rem}.docs-table ::ng-deep td a,.docs-table ::ng-deep td button{line-height:inherit}.docs-table ::ng-deep td .docs-row-actions{height:1.25rem;min-height:1.25rem;width:1.5rem;padding:0}.docs-column-chooser{margin:0;min-width:13rem;max-width:18rem}.docs-column-chooser nb-card-header{font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--docs-text-muted, var(--text-hint-color))}.docs-column-chooser nb-card-body{display:flex;flex-direction:column;gap:.375rem;font-size:var(--docs-body-size, .8125rem)}@media(max-width:1399px){.docs-table{--docs-updated-cell-width: 8rem}}@media(max-width:1199px){.docs-table{--docs-updated-cell-width: 6.5rem}}@media(max-width:767px){.docs-table{--docs-updated-cell-width: 5.25rem}}\n"], dependencies: [{ kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i4.NbCheckboxComponent, selector: "nb-checkbox", inputs: ["checked", "disabled", "status", "indeterminate"], outputs: ["checkedChange"] }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbPopoverDirective, selector: "[nbPopover]", inputs: ["nbPopover", "nbPopoverContext", "nbPopoverPlacement", "nbPopoverAdjustment", "nbPopoverTrigger", "nbPopoverOffset", "nbTooltipDisabled", "nbPopoverClass"], outputs: ["nbPopoverShowStateChange"], exportAs: ["nbPopover"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i7.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "directive", type: i8.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i8.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocsTableComponent = DocsTableComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        DocsRowActionsService,
        DocumentPermissionService,
        NbMenuService,
        NgxPermissionsService])
], DocsTableComponent);
export { DocsTableComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsTableComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-table', standalone: false, template: "<div\n\tclass=\"docs-table\"\n\t[nbSpinner]=\"loading\"\n\tnbSpinnerStatus=\"primary\"\n\tnbSpinnerSize=\"large\"\n\t(click)=\"onRowClick($event)\"\n\t(keydown)=\"onRowKeydown($event)\"\n\t(dblclick)=\"onRowDoubleClick($event)\"\n>\n\t<!-- Column chooser \u2014 header kebab, persisted to localStorage['gauzy_docs_columns'] -->\n\t<div class=\"docs-table-toolbar\" *ngIf=\"!reviewMode\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"tiny\"\n\t\t\tclass=\"docs-column-chooser-toggle\"\n\t\t\t[nbPopover]=\"columnChooser\"\n\t\t\tnbPopoverTrigger=\"click\"\n\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t[nbTooltip]=\"'DOCS.TABLE.COLUMN_CHOOSER' | translate\"\n\t\t\t[attr.aria-label]=\"'DOCS.TABLE.COLUMN_CHOOSER' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"more-vertical-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\n\t<angular2-smart-table\n\t\t[settings]=\"settings\"\n\t\t[source]=\"source\"\n\t\t(userRowSelect)=\"onUserRowSelect($event)\"\n\t\tstyle=\"cursor: pointer\"\n\t></angular2-smart-table>\n</div>\n\n<ng-template #columnChooser>\n\t<nb-card class=\"docs-column-chooser\">\n\t\t<nb-card-header>{{ 'DOCS.TABLE.COLUMN_CHOOSER' | translate }}</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<nb-checkbox\n\t\t\t\t*ngFor=\"let column of selectableColumns\"\n\t\t\t\t[checked]=\"isColumnVisible(column)\"\n\t\t\t\t(checkedChange)=\"toggleColumn(column, $event)\"\n\t\t\t>\n\t\t\t\t{{ columnTitleKey(column) | translate }}\n\t\t\t</nb-checkbox>\n\t\t</nb-card-body>\n\t</nb-card>\n</ng-template>\n", styles: [":host{display:block;min-width:0}.docs-table{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem;--gauzy-table-chip-block-gap: .1875rem;--docs-updated-cell-width: 9.5rem;min-height:12rem;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18));overflow:hidden}.docs-table ::ng-deep table{width:100%;border-collapse:collapse}.docs-table-toolbar{display:flex;justify-content:flex-end;align-items:center;min-height:2rem;padding:.25rem .375rem 0}.docs-table-toolbar .docs-column-chooser-toggle{display:inline-flex;align-items:center;justify-content:center;width:var(--docs-control-height-sm, 1.75rem);height:var(--docs-control-height-sm, 1.75rem);padding:0;border-radius:var(--docs-radius, .375rem)}.docs-table-toolbar .docs-column-chooser-toggle nb-icon{margin:0;font-size:1rem}.docs-table ::ng-deep tr.angular2-smart-titles>th{border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18));vertical-align:middle;white-space:nowrap}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail){background:transparent;border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail):last-child{border-bottom:0}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail):hover{background:var(--docs-hover, rgba(126, 126, 143, .12))!important}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail)>td{vertical-align:middle}.docs-table ::ng-deep tbody tr.angular2-smart-row:not(.angular2-smart-row-detail)>td:last-child{width:3rem;text-align:right;white-space:nowrap}.docs-table ::ng-deep tr.angular2-smart-titles>th:not(.angular2-smart-th),.docs-table ::ng-deep td.angular2-smart-action-multiple-select{width:2.5rem;min-width:2.5rem;padding-inline:.5rem;text-align:center;vertical-align:middle}.docs-table ::ng-deep tr.angular2-smart-titles>th input[type=checkbox],.docs-table ::ng-deep td.angular2-smart-action-multiple-select input[type=checkbox]{display:inline-block;width:.875rem;height:.875rem;margin:0;vertical-align:middle;accent-color:var(--color-primary-default);cursor:pointer;border:none!important;outline:none!important;box-shadow:none!important}.docs-table ::ng-deep tr.angular2-smart-titles>th input[type=checkbox]:focus-visible,.docs-table ::ng-deep td.angular2-smart-action-multiple-select input[type=checkbox]:focus-visible{outline:2px solid var(--color-primary-default)!important;outline-offset:2px}.docs-table ::ng-deep th.angular2-smart-th.name{width:26%;min-width:11rem}.docs-table ::ng-deep th.angular2-smart-th.categories,.docs-table ::ng-deep th.angular2-smart-th.tags{width:12%}.docs-table ::ng-deep th.angular2-smart-th.status,.docs-table ::ng-deep th.angular2-smart-th.knowledge,.docs-table ::ng-deep th.angular2-smart-th.source{width:9%}.docs-table ::ng-deep th.angular2-smart-th.fileSize{width:5.5rem}.docs-table ::ng-deep th.angular2-smart-th.updatedAt{width:calc(var(--docs-updated-cell-width, 9.5rem) + .875rem);white-space:nowrap}.docs-table ::ng-deep th.angular2-smart-th.actions{width:3rem}.docs-table ::ng-deep td{min-width:0}.docs-table ::ng-deep td nb-icon{font-size:.8125rem}.docs-table ::ng-deep td .docs-name-text{font-size:inherit;font-weight:500}.docs-table ::ng-deep td .docs-name-lead{width:1.125rem;height:1.125rem}.docs-table ::ng-deep td a,.docs-table ::ng-deep td button{line-height:inherit}.docs-table ::ng-deep td .docs-row-actions{height:1.25rem;min-height:1.25rem;width:1.5rem;padding:0}.docs-column-chooser{margin:0;min-width:13rem;max-width:18rem}.docs-column-chooser nb-card-header{font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--docs-text-muted, var(--text-hint-color))}.docs-column-chooser nb-card-body{display:flex;flex-direction:column;gap:.375rem;font-size:var(--docs-body-size, .8125rem)}@media(max-width:1399px){.docs-table{--docs-updated-cell-width: 8rem}}@media(max-width:1199px){.docs-table{--docs-updated-cell-width: 6.5rem}}@media(max-width:767px){.docs-table{--docs-updated-cell-width: 5.25rem}}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocsRowActionsService }, { type: i3.DocumentPermissionService }, { type: i4.NbMenuService }, { type: i5.NgxPermissionsService }], propDecorators: { rows: [{
                type: Input
            }], loading: [{
                type: Input
            }], selectable: [{
                type: Input
            }], reviewMode: [{
                type: Input
            }], rowClicked: [{
                type: Output
            }], folderOpened: [{
                type: Output
            }], selectionChanged: [{
                type: Output
            }], sortChanged: [{
                type: Output
            }], retryRequested: [{
                type: Output
            }], previewRequested: [{
                type: Output
            }], editorRequested: [{
                type: Output
            }], onWindowResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=docs-table.component.js.map