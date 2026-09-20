import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { filter } from 'rxjs/operators';
import { DocumentKindEnum, PermissionsEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { sanitizeMediaUrl } from '../../editor/read-only/safe-url.util';
import { buildDocsActionMenu, docsActionMenuSignature, docsActionOf, toDocsActionTarget } from '../actions/docs-action-menu';
import { DocsRowActionsService } from '../actions/docs-row-actions.service';
import { DocumentPermissionService } from '../../services/document-permission.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../actions/docs-row-actions.service";
import * as i3 from "../../services/document-permission.service";
import * as i4 from "@nebular/theme";
import * as i5 from "ngx-permissions";
import * as i6 from "@angular/common";
import * as i7 from "@gauzy/ui-core/shared";
import * as i8 from "../table/cells/status-badge.component";
import * as i9 from "../table/cells/knowledge-badge.component";
import * as i10 from "../table/cells/category-chips.component";
/** Nebular menu-tag prefix for the per-card kebab; the suffix is the document id. */
const CARD_MENU_TAG_PREFIX = 'gz-docs-card-actions-';
/**
 * Cards view (`01-ux-spec.md` §4.2): folder cards first (icon/color, name,
 * child count, drill-in), then document cards (kind/mime icon, name, badge
 * row, category chips, updated + size footer). A breadcrumb row above the
 * grid tracks the current tree location; "Load more" appends the next batch.
 * With an active search/preset/facet the grid flattens (no folder cards) and
 * shows the `DOCS.CARDS.FLAT_RESULTS_HINT` bar.
 */
let DocsCardsComponent = class DocsCardsComponent extends TranslationBaseComponent {
    // `TranslationBaseComponent` carries no Angular decorator, so an inherited
    // constructor is not injectable under AOT (NG2006) — declare it explicitly.
    constructor(translateService, rowActions, documentPermission, nbMenuService, permissionsService) {
        super(translateService);
        this.translateService = translateService;
        this.rowActions = rowActions;
        this.documentPermission = documentPermission;
        this.nbMenuService = nbMenuService;
        this.permissionsService = permissionsService;
        this.rows = [];
        this.totalCount = 0;
        this.loading = false;
        /** Flat results mode: search or a non-All preset active — folder cards hidden. */
        this.flat = false;
        /**
         * Ancestor chain of the current tree location; empty = root.
         *
         * The grid no longer renders it — the browse page header does, so the crumbs
         * survive the table layout and an empty folder. Kept as an input (with
         * {@link onCrumbClick}) so an embedder that renders the grid on its own can
         * still drive `drillIn` from a crumb.
         */
        this.breadcrumb = [];
        /** Card whose detail panel is open gets `active` styling. */
        this.activeId = null;
        /** Card body click — opens the detail panel (`01-ux-spec.md` §4.2). */
        this.open = new EventEmitter();
        /** FILE card preview affordance — the browse page opens `gz-docs-preview-modal`. */
        this.preview = new EventEmitter();
        /** PAGE card open-in-editor affordance. */
        this.openEditor = new EventEmitter();
        /** Folder card click — sets the tree location (`?folder=`); `null` = root crumb. */
        this.drillIn = new EventEmitter();
        this.loadMore = new EventEmitter();
        this.kindEnum = DocumentKindEnum;
        /**
         * Documents whose thumbnail failed to load — a signed provider URL that expired between
         * the list response and the `<img>` fetch, or a thumbnail deleted from storage. Recorded
         * per card so the row falls back to its kind icon instead of rendering a broken image.
         */
        this.failedThumbnails = new Set();
        /** Permission flags backing the card kebab (the item set is permission-filtered). */
        this.permissions = { create: false, update: false, delete: false, aiImport: false };
        /** documentId → last built menu, keyed by the signature it was built from. */
        this.menuCache = new Map();
    }
    ngOnInit() {
        this.permissionsService.permissions$.pipe(untilDestroyed(this)).subscribe((permissions) => {
            this.permissions = {
                create: !!permissions[PermissionsEnum.DOCS_CREATE],
                update: !!permissions[PermissionsEnum.DOCS_UPDATE],
                delete: !!permissions[PermissionsEnum.DOCS_DELETE],
                aiImport: !!permissions[PermissionsEnum.DOCS_AI_IMPORT]
            };
            this.menuCache.clear();
        });
        // Labels are baked in at build time — a language switch or a star toggled
        // elsewhere has to drop the memo.
        this.translateService.onLangChange.pipe(untilDestroyed(this)).subscribe(() => this.menuCache.clear());
        this.rowActions.favoriteIds$.pipe(untilDestroyed(this)).subscribe(() => this.menuCache.clear());
        // One subscription for the whole grid; the clicked card rides on the tag.
        this.nbMenuService
            .onItemClick()
            .pipe(filter(({ tag }) => (tag ?? '').startsWith(CARD_MENU_TAG_PREFIX)), untilDestroyed(this))
            .subscribe(({ tag, item }) => {
            // A menu click cannot be awaited; `execute()` owns its failure path.
            void this.onCardAction(docsActionOf(item), tag.slice(CARD_MENU_TAG_PREFIX.length));
        });
    }
    // ─── Card kebab (`01-ux-spec.md` §4.2) ───────────────────────
    menuTag(row) {
        return `${CARD_MENU_TAG_PREFIX}${row.id}`;
    }
    /**
     * The card's action menu, from the shared builder.
     *
     * 🛑 Memoized on everything the item set is derived from: this is called from a
     * template binding, and `[nbContextMenu]` rebuilds its overlay whenever the
     * bound array is a new reference.
     */
    menuItemsFor(row) {
        const target = toDocsActionTarget(row);
        const context = this.menuContext(row);
        const signature = docsActionMenuSignature(target, context);
        const cached = this.menuCache.get(String(row.id));
        if (cached?.signature === signature)
            return cached.items;
        const items = buildDocsActionMenu(target, context);
        this.menuCache.set(String(row.id), { signature, items });
        return items;
    }
    menuContext(row) {
        return {
            surface: 'row',
            translate: (key) => this.getTranslation(key),
            isFavorite: this.rowActions.isFavorite(row?.id),
            // Ownership half of the write rule (spec 08 §1.7) — same list projection the
            // table reads it from.
            canMutate: this.documentPermission.canMutate(row),
            permissions: this.permissions
        };
    }
    /**
     * The view actions stay with the grid — "open" on a card means what the card
     * already does on double click — and everything else goes to the shared
     * executor, so a card action behaves exactly like the same action in the table.
     */
    async onCardAction(action, id) {
        const row = (this.rows ?? []).find((candidate) => String(candidate.id) === id);
        if (!row || !action)
            return;
        switch (action) {
            case 'details':
                this.open.emit(row);
                return;
            case 'open':
            case 'preview':
                this.onDefaultOpen(row);
                return;
            default:
                if (await this.rowActions.execute(action, toDocsActionTarget(row))) {
                    this.menuCache.delete(String(row.id));
                }
        }
    }
    get folderCards() {
        return this.flat ? [] : this.rows.filter((row) => row.kind === DocumentKindEnum.FOLDER);
    }
    get documentCards() {
        return this.flat ? this.rows : this.rows.filter((row) => row.kind !== DocumentKindEnum.FOLDER);
    }
    get hasMore() {
        return this.rows.length < this.totalCount;
    }
    onCardClick(row) {
        if (row.kind === DocumentKindEnum.FOLDER) {
            this.drillIn.emit(row.id);
        }
        else {
            this.open.emit(row);
        }
    }
    /** Crumb → drill-in. A redacted segment has no id to drill into and is ignored. */
    onCrumbClick(crumb) {
        if (crumb?.restricted)
            return;
        this.drillIn.emit(crumb.id);
    }
    /** Per-kind default open (card kebab / double click), mirroring the table. */
    onDefaultOpen(row, event) {
        event?.stopPropagation();
        if (row.kind === DocumentKindEnum.FILE) {
            this.preview.emit(row);
        }
        else if (row.kind === DocumentKindEnum.PAGE) {
            this.openEditor.emit(row);
        }
        else {
            this.drillIn.emit(row.id);
        }
    }
    isActive(row) {
        return this.activeId != null && String(this.activeId) === String(row.id);
    }
    kindIcon(row) {
        switch (row.kind) {
            case DocumentKindEnum.FOLDER:
                return 'folder-outline';
            case DocumentKindEnum.PAGE:
                return 'file-text-outline';
            default:
                return this.fileIcon(row.mimeType);
        }
    }
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
    thumbnailUrl(row) {
        if (!row?.thumbUrl || this.failedThumbnails.has(String(row.id)))
            return null;
        return sanitizeMediaUrl(row.thumbUrl);
    }
    /** A thumbnail that 404s or expires degrades to the kind icon rather than a broken image. */
    onThumbnailError(row) {
        this.failedThumbnails.add(String(row.id));
    }
    humanizeSize(bytes) {
        if (!bytes || bytes <= 0)
            return '';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
    }
    trackById(_, row) {
        return String(row.id);
    }
    fileIcon(mimeType) {
        if (!mimeType)
            return 'file-outline';
        if (mimeType === 'application/pdf')
            return 'file-text-outline';
        if (mimeType.startsWith('image/'))
            return 'image-outline';
        if (mimeType.startsWith('video/') || mimeType.startsWith('audio/'))
            return 'film-outline';
        if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel'))
            return 'grid-outline';
        if (mimeType.includes('word') || mimeType.includes('opendocument.text'))
            return 'file-text-outline';
        return 'file-outline';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsCardsComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocsRowActionsService }, { token: i3.DocumentPermissionService }, { token: i4.NbMenuService }, { token: i5.NgxPermissionsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsCardsComponent, isStandalone: false, selector: "gz-docs-cards", inputs: { rows: "rows", totalCount: "totalCount", loading: "loading", flat: "flat", breadcrumb: "breadcrumb", activeId: "activeId" }, outputs: { open: "open", preview: "preview", openEditor: "openEditor", drillIn: "drillIn", loadMore: "loadMore" }, usesInheritance: true, ngImport: i0, template: "<div class=\"docs-cards\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- The breadcrumb row moved to the browse page header (`00-product-spec.md` \u00A76.9\n\t     R-TRE-01): it has to render in the table layout and on an empty folder too,\n\t     and both of those sit outside this component. -->\n\n\t<!-- Flat results hint (search / non-All preset active) -->\n\t<div class=\"docs-cards-flat-hint\" *ngIf=\"flat\">\n\t\t<nb-icon icon=\"funnel-outline\"></nb-icon>\n\t\t<span>{{ 'DOCS.CARDS.FLAT_RESULTS_HINT' | translate }}</span>\n\t</div>\n\n\t<div class=\"docs-cards-grid\">\n\t\t<!-- Folder cards first. A real <button> replaces the former `role=\"button\"` div, so\n\t\t     focus, Enter and Space come from the platform (the explicit tabindex/keydown pair\n\t\t     is what a native button already does \u2014 keeping it would fire the handler twice).\n\t\t     The inline rules only undo the user-agent button chrome `.docs-card` does not\n\t\t     already override, so the card renders exactly as before. -->\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"docs-card docs-card-folder\"\n\t\t\t*ngFor=\"let folder of folderCards; trackBy: trackById\"\n\t\t\t[class.active]=\"isActive(folder)\"\n\t\t\t[class.archived]=\"folder.isArchived\"\n\t\t\tstyle=\"width: 100%; align-items: stretch; text-align: inherit; font: inherit; color: inherit\"\n\t\t\t(click)=\"onCardClick(folder)\"\n\t\t>\n\t\t\t<div class=\"docs-card-head\">\n\t\t\t\t<span class=\"docs-card-emoji\" *ngIf=\"folder.icon; else folderEva\">{{ folder.icon }}</span>\n\t\t\t\t<ng-template #folderEva>\n\t\t\t\t\t<nb-icon icon=\"folder-outline\" [style.color]=\"folder.color || null\"></nb-icon>\n\t\t\t\t</ng-template>\n\t\t\t\t<span class=\"docs-card-name\" [nbTooltip]=\"folder.name\">{{ folder.name }}</span>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-footer\">\n\t\t\t\t<span>{{ 'DOCS.CARDS.ITEMS_COUNT' | translate : { count: folder.childrenCount ?? 0 } }}</span>\n\t\t\t</div>\n\t\t</button>\n\n\t\t<!-- Document cards.\n\t\t     Deliberately still `role=\"button\"` on a div, unlike the folder card above: this card\n\t\t     CONTAINS the `.docs-card-open` button (below), and `<button>` may not contain\n\t\t     interactive content \u2014 nesting one would be invalid HTML that browsers reparent, which\n\t\t     is worse for assistive tech than the explicit role. The div is keyboard-operable\n\t\t     (`tabindex=\"0\"` + `keydown.enter`), so the accessible behaviour is already correct.\n\t\t     Making this native needs `.docs-card-open` lifted out of the card into an\n\t\t     absolutely-positioned sibling \u2014 a layout change, not a markup fix. -->\n\t\t<div\n\t\t\tclass=\"docs-card\"\n\t\t\t*ngFor=\"let doc of documentCards; trackBy: trackById\"\n\t\t\t[class.active]=\"isActive(doc)\"\n\t\t\t[class.archived]=\"doc.isArchived\"\n\t\t\trole=\"button\"\n\t\t\ttabindex=\"0\"\n\t\t\t(click)=\"onCardClick(doc)\"\n\t\t\t(dblclick)=\"onDefaultOpen(doc, $event)\"\n\t\t\t(keydown.enter)=\"onCardClick(doc)\"\n\t\t>\n\t\t\t<!-- Preview tile. The box is ALWAYS rendered at a fixed height, whether or not a\n\t\t\t     thumbnail exists: `thumbUrl` only appears once the P1 thumbnail job has run, so\n\t\t\t     a box that materialized with the image would reflow the whole grid on the next\n\t\t\t     processing poll. Without one (or when the image fails to load) the tile holds\n\t\t\t     the same kind icon the card used to show inline. -->\n\t\t\t<div class=\"docs-card-thumb\">\n\t\t\t\t<img\n\t\t\t\t\t*ngIf=\"thumbnailUrl(doc) as thumbnail; else docThumbFallback\"\n\t\t\t\t\tclass=\"docs-card-thumb-image\"\n\t\t\t\t\t[src]=\"thumbnail\"\n\t\t\t\t\talt=\"\"\n\t\t\t\t\tloading=\"lazy\"\n\t\t\t\t\t(error)=\"onThumbnailError(doc)\"\n\t\t\t\t/>\n\t\t\t\t<ng-template #docThumbFallback>\n\t\t\t\t\t<span class=\"docs-card-emoji\" *ngIf=\"doc.icon; else docEva\">{{ doc.icon }}</span>\n\t\t\t\t\t<ng-template #docEva>\n\t\t\t\t\t\t<nb-icon [icon]=\"kindIcon(doc)\" [style.color]=\"doc.color || null\"></nb-icon>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</ng-template>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-head\">\n\t\t\t\t<span class=\"docs-card-name\" [nbTooltip]=\"doc.summary || doc.originalFilename || doc.name\">\n\t\t\t\t\t{{ doc.name }}\n\t\t\t\t</span>\n\t\t\t\t<!-- Per-kind default open: FILE \u2192 preview modal, PAGE \u2192 editor -->\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"doc.kind === kindEnum.FILE\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"docs-card-open\"\n\t\t\t\t\t(click)=\"onDefaultOpen(doc, $event)\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.TITLE' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"doc.kind === kindEnum.PAGE\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"docs-card-open\"\n\t\t\t\t\t(click)=\"onDefaultOpen(doc, $event)\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.EDITOR.TITLE' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"external-link-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<!-- Row actions kebab (`01-ux-spec.md` \u00A74.2: \"kebab with the same row\n\t\t\t\t     actions\"), built by the same builder as the table column and the\n\t\t\t\t     tree context menu. -->\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"menuItemsFor(doc).length\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"docs-card-open docs-card-actions\"\n\t\t\t\t\t[nbContextMenu]=\"menuItemsFor(doc)\"\n\t\t\t\t\t[nbContextMenuTag]=\"menuTag(doc)\"\n\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.NODE_ACTIONS' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"more-horizontal-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-badges\">\n\t\t\t\t<gz-docs-status-badge *ngIf=\"doc.kind === kindEnum.FILE\" [rowData]=\"doc\"></gz-docs-status-badge>\n\t\t\t\t<gz-docs-knowledge-badge [rowData]=\"doc\"></gz-docs-knowledge-badge>\n\t\t\t\t<nb-badge\n\t\t\t\t\t*ngIf=\"doc.reviewStatus === 'PENDING'\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t[text]=\"'DOCS.REVIEW.PENDING' | translate\"\n\t\t\t\t></nb-badge>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-chips\">\n\t\t\t\t<gz-docs-category-chips [rowData]=\"doc\"></gz-docs-category-chips>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-footer\">\n\t\t\t\t<span>{{ doc.updatedAt | date : 'mediumDate' }}</span>\n\t\t\t\t<span *ngIf=\"doc.fileSize\">{{ humanizeSize(doc.fileSize) }}</span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<!-- Load more -->\n\t<div class=\"docs-cards-more\" *ngIf=\"hasMore\">\n\t\t<button nbButton size=\"small\" appearance=\"outline\" [disabled]=\"loading\" (click)=\"loadMore.emit()\">\n\t\t\t{{ 'DOCS.CARDS.LOAD_MORE' | translate }}\n\t\t</button>\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-cards-flat-hint{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem;padding:.375rem .625rem;border-radius:var(--docs-radius, .375rem);background:var(--docs-surface-sunken, var(--background-basic-color-2));color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-meta-size, .75rem)}.docs-cards-flat-hint nb-icon{flex:0 0 auto;font-size:.875rem}.docs-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(13.5rem,1fr));gap:.75rem}.docs-card{display:flex;flex-direction:column;gap:.5rem;min-width:0;padding:.75rem;border:0;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18));color:var(--docs-text, var(--text-basic-color));cursor:pointer;transition:box-shadow .15s ease,background-color .15s ease}.docs-card:hover,.docs-card:focus-visible{box-shadow:inset 0 0 0 1px var(--color-primary-default);background:var(--docs-hover, var(--gauzy-card-2));outline:none}.docs-card.active{box-shadow:inset 0 0 0 2px var(--color-primary-default)}.docs-card.archived{opacity:.6}.docs-card-folder{justify-content:space-between;min-height:5.5rem}.docs-card-thumb{display:flex;align-items:center;justify-content:center;height:6.25rem;overflow:hidden;border-radius:var(--docs-radius, .375rem);background:var(--docs-surface-sunken, var(--background-basic-color-2))}.docs-card-thumb .docs-card-thumb-image{width:100%;height:100%;object-fit:cover}.docs-card-thumb .docs-card-emoji{font-size:1.75rem;line-height:1}.docs-card-thumb nb-icon{font-size:1.75rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-card-head{display:flex;align-items:center;gap:.375rem;min-width:0}.docs-card-head .docs-card-emoji{flex:0 0 auto;font-size:1rem;line-height:1}.docs-card-head>nb-icon{flex:0 0 auto;font-size:1rem}.docs-card-head .docs-card-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--docs-body-size, .8125rem);font-weight:600;flex:1 1 auto;min-width:0}.docs-card-head .docs-card-open{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.5rem;height:1.5rem;padding:0;border-radius:var(--docs-radius, .375rem);opacity:0}.docs-card-head .docs-card-open nb-icon{margin:0;font-size:.875rem}.docs-card:hover .docs-card-open,.docs-card:focus-within .docs-card-open{opacity:1}@media(hover:none){.docs-card .docs-card-open{opacity:1}}.docs-card-badges{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem;min-height:var(--gauzy-table-badge-height, 1.25rem)}.docs-card-badges ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;transform:none}.docs-card-chips{min-height:1rem;min-width:0}.docs-card-footer{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:auto;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-card-footer span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-cards-more{display:flex;justify-content:center;margin-top:1rem}@media(max-width:575px){.docs-cards-grid{grid-template-columns:repeat(auto-fill,minmax(10.5rem,1fr));gap:.625rem}.docs-card-thumb{height:5rem}}\n"], dependencies: [{ kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i4.NbContextMenuDirective, selector: "[nbContextMenu]", inputs: ["nbContextMenuPlacement", "nbContextMenuAdjustment", "nbContextMenuTag", "nbContextMenu", "nbContextMenuTrigger", "nbContextMenuClass"] }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i7.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "component", type: i8.StatusBadgeComponent, selector: "gz-docs-status-badge", inputs: ["rowData", "value"] }, { kind: "component", type: i9.KnowledgeBadgeComponent, selector: "gz-docs-knowledge-badge", inputs: ["rowData", "value"] }, { kind: "component", type: i10.CategoryChipsComponent, selector: "gz-docs-category-chips", inputs: ["rowData", "value", "max"] }, { kind: "pipe", type: i6.DatePipe, name: "date" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocsCardsComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        DocsRowActionsService,
        DocumentPermissionService,
        NbMenuService,
        NgxPermissionsService])
], DocsCardsComponent);
export { DocsCardsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsCardsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-cards', standalone: false, template: "<div class=\"docs-cards\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- The breadcrumb row moved to the browse page header (`00-product-spec.md` \u00A76.9\n\t     R-TRE-01): it has to render in the table layout and on an empty folder too,\n\t     and both of those sit outside this component. -->\n\n\t<!-- Flat results hint (search / non-All preset active) -->\n\t<div class=\"docs-cards-flat-hint\" *ngIf=\"flat\">\n\t\t<nb-icon icon=\"funnel-outline\"></nb-icon>\n\t\t<span>{{ 'DOCS.CARDS.FLAT_RESULTS_HINT' | translate }}</span>\n\t</div>\n\n\t<div class=\"docs-cards-grid\">\n\t\t<!-- Folder cards first. A real <button> replaces the former `role=\"button\"` div, so\n\t\t     focus, Enter and Space come from the platform (the explicit tabindex/keydown pair\n\t\t     is what a native button already does \u2014 keeping it would fire the handler twice).\n\t\t     The inline rules only undo the user-agent button chrome `.docs-card` does not\n\t\t     already override, so the card renders exactly as before. -->\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"docs-card docs-card-folder\"\n\t\t\t*ngFor=\"let folder of folderCards; trackBy: trackById\"\n\t\t\t[class.active]=\"isActive(folder)\"\n\t\t\t[class.archived]=\"folder.isArchived\"\n\t\t\tstyle=\"width: 100%; align-items: stretch; text-align: inherit; font: inherit; color: inherit\"\n\t\t\t(click)=\"onCardClick(folder)\"\n\t\t>\n\t\t\t<div class=\"docs-card-head\">\n\t\t\t\t<span class=\"docs-card-emoji\" *ngIf=\"folder.icon; else folderEva\">{{ folder.icon }}</span>\n\t\t\t\t<ng-template #folderEva>\n\t\t\t\t\t<nb-icon icon=\"folder-outline\" [style.color]=\"folder.color || null\"></nb-icon>\n\t\t\t\t</ng-template>\n\t\t\t\t<span class=\"docs-card-name\" [nbTooltip]=\"folder.name\">{{ folder.name }}</span>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-footer\">\n\t\t\t\t<span>{{ 'DOCS.CARDS.ITEMS_COUNT' | translate : { count: folder.childrenCount ?? 0 } }}</span>\n\t\t\t</div>\n\t\t</button>\n\n\t\t<!-- Document cards.\n\t\t     Deliberately still `role=\"button\"` on a div, unlike the folder card above: this card\n\t\t     CONTAINS the `.docs-card-open` button (below), and `<button>` may not contain\n\t\t     interactive content \u2014 nesting one would be invalid HTML that browsers reparent, which\n\t\t     is worse for assistive tech than the explicit role. The div is keyboard-operable\n\t\t     (`tabindex=\"0\"` + `keydown.enter`), so the accessible behaviour is already correct.\n\t\t     Making this native needs `.docs-card-open` lifted out of the card into an\n\t\t     absolutely-positioned sibling \u2014 a layout change, not a markup fix. -->\n\t\t<div\n\t\t\tclass=\"docs-card\"\n\t\t\t*ngFor=\"let doc of documentCards; trackBy: trackById\"\n\t\t\t[class.active]=\"isActive(doc)\"\n\t\t\t[class.archived]=\"doc.isArchived\"\n\t\t\trole=\"button\"\n\t\t\ttabindex=\"0\"\n\t\t\t(click)=\"onCardClick(doc)\"\n\t\t\t(dblclick)=\"onDefaultOpen(doc, $event)\"\n\t\t\t(keydown.enter)=\"onCardClick(doc)\"\n\t\t>\n\t\t\t<!-- Preview tile. The box is ALWAYS rendered at a fixed height, whether or not a\n\t\t\t     thumbnail exists: `thumbUrl` only appears once the P1 thumbnail job has run, so\n\t\t\t     a box that materialized with the image would reflow the whole grid on the next\n\t\t\t     processing poll. Without one (or when the image fails to load) the tile holds\n\t\t\t     the same kind icon the card used to show inline. -->\n\t\t\t<div class=\"docs-card-thumb\">\n\t\t\t\t<img\n\t\t\t\t\t*ngIf=\"thumbnailUrl(doc) as thumbnail; else docThumbFallback\"\n\t\t\t\t\tclass=\"docs-card-thumb-image\"\n\t\t\t\t\t[src]=\"thumbnail\"\n\t\t\t\t\talt=\"\"\n\t\t\t\t\tloading=\"lazy\"\n\t\t\t\t\t(error)=\"onThumbnailError(doc)\"\n\t\t\t\t/>\n\t\t\t\t<ng-template #docThumbFallback>\n\t\t\t\t\t<span class=\"docs-card-emoji\" *ngIf=\"doc.icon; else docEva\">{{ doc.icon }}</span>\n\t\t\t\t\t<ng-template #docEva>\n\t\t\t\t\t\t<nb-icon [icon]=\"kindIcon(doc)\" [style.color]=\"doc.color || null\"></nb-icon>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</ng-template>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-head\">\n\t\t\t\t<span class=\"docs-card-name\" [nbTooltip]=\"doc.summary || doc.originalFilename || doc.name\">\n\t\t\t\t\t{{ doc.name }}\n\t\t\t\t</span>\n\t\t\t\t<!-- Per-kind default open: FILE \u2192 preview modal, PAGE \u2192 editor -->\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"doc.kind === kindEnum.FILE\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"docs-card-open\"\n\t\t\t\t\t(click)=\"onDefaultOpen(doc, $event)\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.PREVIEW.TITLE' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"doc.kind === kindEnum.PAGE\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"docs-card-open\"\n\t\t\t\t\t(click)=\"onDefaultOpen(doc, $event)\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.EDITOR.TITLE' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"external-link-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<!-- Row actions kebab (`01-ux-spec.md` \u00A74.2: \"kebab with the same row\n\t\t\t\t     actions\"), built by the same builder as the table column and the\n\t\t\t\t     tree context menu. -->\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"menuItemsFor(doc).length\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tclass=\"docs-card-open docs-card-actions\"\n\t\t\t\t\t[nbContextMenu]=\"menuItemsFor(doc)\"\n\t\t\t\t\t[nbContextMenuTag]=\"menuTag(doc)\"\n\t\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.NODE_ACTIONS' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"more-horizontal-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-badges\">\n\t\t\t\t<gz-docs-status-badge *ngIf=\"doc.kind === kindEnum.FILE\" [rowData]=\"doc\"></gz-docs-status-badge>\n\t\t\t\t<gz-docs-knowledge-badge [rowData]=\"doc\"></gz-docs-knowledge-badge>\n\t\t\t\t<nb-badge\n\t\t\t\t\t*ngIf=\"doc.reviewStatus === 'PENDING'\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t[text]=\"'DOCS.REVIEW.PENDING' | translate\"\n\t\t\t\t></nb-badge>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-chips\">\n\t\t\t\t<gz-docs-category-chips [rowData]=\"doc\"></gz-docs-category-chips>\n\t\t\t</div>\n\t\t\t<div class=\"docs-card-footer\">\n\t\t\t\t<span>{{ doc.updatedAt | date : 'mediumDate' }}</span>\n\t\t\t\t<span *ngIf=\"doc.fileSize\">{{ humanizeSize(doc.fileSize) }}</span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<!-- Load more -->\n\t<div class=\"docs-cards-more\" *ngIf=\"hasMore\">\n\t\t<button nbButton size=\"small\" appearance=\"outline\" [disabled]=\"loading\" (click)=\"loadMore.emit()\">\n\t\t\t{{ 'DOCS.CARDS.LOAD_MORE' | translate }}\n\t\t</button>\n\t</div>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-cards-flat-hint{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem;padding:.375rem .625rem;border-radius:var(--docs-radius, .375rem);background:var(--docs-surface-sunken, var(--background-basic-color-2));color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-meta-size, .75rem)}.docs-cards-flat-hint nb-icon{flex:0 0 auto;font-size:.875rem}.docs-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(13.5rem,1fr));gap:.75rem}.docs-card{display:flex;flex-direction:column;gap:.5rem;min-width:0;padding:.75rem;border:0;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18));color:var(--docs-text, var(--text-basic-color));cursor:pointer;transition:box-shadow .15s ease,background-color .15s ease}.docs-card:hover,.docs-card:focus-visible{box-shadow:inset 0 0 0 1px var(--color-primary-default);background:var(--docs-hover, var(--gauzy-card-2));outline:none}.docs-card.active{box-shadow:inset 0 0 0 2px var(--color-primary-default)}.docs-card.archived{opacity:.6}.docs-card-folder{justify-content:space-between;min-height:5.5rem}.docs-card-thumb{display:flex;align-items:center;justify-content:center;height:6.25rem;overflow:hidden;border-radius:var(--docs-radius, .375rem);background:var(--docs-surface-sunken, var(--background-basic-color-2))}.docs-card-thumb .docs-card-thumb-image{width:100%;height:100%;object-fit:cover}.docs-card-thumb .docs-card-emoji{font-size:1.75rem;line-height:1}.docs-card-thumb nb-icon{font-size:1.75rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-card-head{display:flex;align-items:center;gap:.375rem;min-width:0}.docs-card-head .docs-card-emoji{flex:0 0 auto;font-size:1rem;line-height:1}.docs-card-head>nb-icon{flex:0 0 auto;font-size:1rem}.docs-card-head .docs-card-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--docs-body-size, .8125rem);font-weight:600;flex:1 1 auto;min-width:0}.docs-card-head .docs-card-open{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.5rem;height:1.5rem;padding:0;border-radius:var(--docs-radius, .375rem);opacity:0}.docs-card-head .docs-card-open nb-icon{margin:0;font-size:.875rem}.docs-card:hover .docs-card-open,.docs-card:focus-within .docs-card-open{opacity:1}@media(hover:none){.docs-card .docs-card-open{opacity:1}}.docs-card-badges{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem;min-height:var(--gauzy-table-badge-height, 1.25rem)}.docs-card-badges ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;transform:none}.docs-card-chips{min-height:1rem;min-width:0}.docs-card-footer{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:auto;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-card-footer span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-cards-more{display:flex;justify-content:center;margin-top:1rem}@media(max-width:575px){.docs-cards-grid{grid-template-columns:repeat(auto-fill,minmax(10.5rem,1fr));gap:.625rem}.docs-card-thumb{height:5rem}}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocsRowActionsService }, { type: i3.DocumentPermissionService }, { type: i4.NbMenuService }, { type: i5.NgxPermissionsService }], propDecorators: { rows: [{
                type: Input
            }], totalCount: [{
                type: Input
            }], loading: [{
                type: Input
            }], flat: [{
                type: Input
            }], breadcrumb: [{
                type: Input
            }], activeId: [{
                type: Input
            }], open: [{
                type: Output
            }], preview: [{
                type: Output
            }], openEditor: [{
                type: Output
            }], drillIn: [{
                type: Output
            }], loadMore: [{
                type: Output
            }] } });
//# sourceMappingURL=docs-cards.component.js.map