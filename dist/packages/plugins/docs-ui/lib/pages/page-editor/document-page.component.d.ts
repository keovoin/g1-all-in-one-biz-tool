import { OnDestroy, OnInit } from '@angular/core';
import { BaseEntityEnum, IDocument, PermissionsEnum } from '@gauzy/contracts';
import { BlockCommentThreadComponent } from '../../editor/comments/block-comment-thread.component';
import { DocumentEditorComponent, IEditorStats, ITocAnchor } from '../../editor/document-editor.component';
import { DocsSaveState } from '../../editor/services/document-autosave.service';
import { IDocsTreeNode } from '../../services/document-tree.store';
import * as i0 from "@angular/core";
type RailTab = 'toc' | 'info' | 'comments';
/**
 * Page editor chrome (UX spec §10 / spec 04 §4.8) hosting `gz-document-editor`:
 * breadcrumbs, icon + inline title, favorite star, lock toggle, autosave pill,
 * overflow menu (full width, copy link/markdown, save version now, invisibles,
 * duplicate, move, archive, version history), ToC + Info right rail, conflict /
 * locked / read-only banners. Lazily loaded — the whole editor stack is one
 * chunk behind this route (spec 05 §12).
 */
export declare class DocumentPageComponent implements OnInit, OnDestroy {
    editorComponent?: DocumentEditorComponent;
    commentsPanel?: BlockCommentThreadComponent;
    private readonly route;
    private readonly router;
    private readonly documentsService;
    private readonly exportService;
    private readonly treeStore;
    private readonly documentPermission;
    private readonly dialogService;
    private readonly toastrService;
    private readonly translate;
    private readonly store;
    private readonly actions;
    private readonly cdr;
    private readonly destroyRef;
    readonly favoriteEntity = BaseEntityEnum.Document;
    readonly PermissionsEnum: typeof PermissionsEnum;
    document: IDocument | null;
    loading: boolean;
    loadError: boolean;
    saveState: DocsSaveState;
    stats: IEditorStats | null;
    tocAnchors: ITocAnchor[];
    breadcrumbs: IDocsTreeNode[];
    railTab: RailTab;
    railOpen: boolean;
    versionsOpen: boolean;
    menuOpen: boolean;
    iconPickerOpen: boolean;
    fullWidth: boolean;
    titleDraft: string;
    iconDraft: string;
    /** The block whose thread the Comments rail is showing; `null` lists them all. */
    commentBlockId: string | null;
    /** `blockId`s the editor currently holds — lets the rail flag detached threads. */
    knownBlockIds: string[];
    /** A `?block=` deep link waiting for the editor to paint. */
    private pendingBlockAnchor;
    /** `metadata.schemaVersion` of the loaded content — drives the "newer format" banner. */
    contentSchemaVersion: number | null;
    get canUpdate(): boolean;
    /**
     * Row-level ownership scope of the open document (`08-permissions-security.md` §1.7):
     * `DOCS_MANAGE` holder or its creator.
     */
    get canMutate(): boolean;
    /**
     * Both halves of the server's write rule — `DOCS_UPDATE` **and** the ownership scope.
     *
     * 🛑 The permission alone is not enough: `assertCanWrite()` (`plugins/docs/.../
     * document.service.ts`) answers `403 DOCS_WRITE_FORBIDDEN` for a non-creator without
     * `DOCS_MANAGE`, so gating the chrome on `canUpdate` alone opened a fully live editor whose
     * every autosave failed. This is what the read-only banner and the write controls read.
     */
    get canWrite(): boolean;
    get isLocked(): boolean;
    get editable(): boolean;
    get isPage(): boolean;
    get isPendingReview(): boolean;
    /**
     * A manual review request is what makes the queue reachable with AI off, so
     * the editor offers it too — but never while the document is already PENDING
     * (the menu shows that state instead; the backend would no-op) nor once it is
     * archived.
     */
    get canRequestReview(): boolean;
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** True while the editor holds edits the server has not acknowledged. */
    get hasUnsavedChanges(): boolean;
    /**
     * Flushes pending edits and reports whether they landed.
     *
     * `false` means the guard must ask before discarding — a 409 conflict freeze, a 423
     * lock, or an offline backoff all leave the content only in the browser.
     */
    flushPendingChanges(): Promise<boolean>;
    /** Flush while dirty on tab close (spec 05 §9.2 beforeunload guard). */
    onBeforeUnload(event: BeforeUnloadEvent): void;
    onVisibilityChange(): void;
    load(id?: string | null): Promise<void>;
    private loadBreadcrumbs;
    onSaveStateChanged(state: DocsSaveState): void;
    onStatsChanged(stats: IEditorStats): void;
    onTocChanged(anchors: ITocAnchor[]): void;
    /**
     * The loaded content's `metadata.schemaVersion` (spec 05 §9.1). `null` = saved before the
     * stamp existed, which is older than v1, never newer.
     */
    onSchemaVersionChanged(version: number | null): void;
    /**
     * True when this build's extension set is OLDER than the one that wrote the content.
     *
     * 🛑 Saving here would round-trip the JSON through a schema that does not know the newer
     * node types and quietly drop them (spec 05 §9.1: "unknown node types throw on JSON load
     * — never ship a schema change without a loader shim"). The banner is the warning; the
     * shim itself belongs to whichever release bumps the version.
     */
    get schemaAhead(): boolean;
    scrollToAnchor(anchor: ITocAnchor): void;
    /** Opens the Comments tab. Without a block in focus it lists every anchored thread. */
    openCommentsTab(): void;
    /** The bubble menu's comment action, a gutter marker, or a `?block=` deep link. */
    openCommentsFor(blockId: string): void;
    /**
     * The rail reports which blocks still have an open thread; the editor turns them into
     * gutter markers. One fetch, one source of truth — the editor never queries comments.
     */
    onOpenCommentBlocks(blockIds: string[]): void;
    /** A thread header was clicked — jump to its block in the canvas. */
    onCommentBlockFocused(blockId: string): void;
    /**
     * Re-reads the editor's block ids so the rail can tell a live thread from one whose
     * block was deleted. Cheap (a single doc walk) and only run when the rail is opened.
     */
    private refreshKnownBlocks;
    /**
     * Retries the `?block=` scroll until the editor has painted the block.
     *
     * The editor is constructed in `afterNextRender` and the document JSON only reaches it
     * once `load()` resolves, so the element a deep link points at does not exist when the
     * query param arrives. Bounded retries, then give up quietly — a stale link to a deleted
     * block must not spin.
     */
    private applyPendingBlockAnchor;
    saveTitle(): Promise<void>;
    saveIcon(): Promise<void>;
    toggleLock(): Promise<void>;
    copyLink(): Promise<void>;
    /**
     * Copy / download / print all share one resolution path
     * (`DocsExportService`), fed the live editor output when an editor is
     * mounted. Handing it `markdown`/`html` from the editor keeps the export
     * byte-identical to what the user is looking at — including edits that have
     * not been autosaved yet — and skips the refetch + static re-render entirely.
     */
    private exportSource;
    copyMarkdown(): Promise<void>;
    /** Downloads the page as a `.md` file (spec 01 §10.9 "Export (Markdown now)"). */
    exportMarkdown(): Promise<void>;
    /** Print-CSS PDF path (spec 05 §9.1 tier 3 — the browser's "Save as PDF"). */
    print(): Promise<void>;
    /** Share overlay + visibility toggle (spec 08 §3). */
    openShareDialog(): void;
    saveVersionNow(): Promise<void>;
    toggleInvisibles(): void;
    toggleFullWidth(): void;
    duplicate(): Promise<void>;
    openMoveDialog(): void;
    /**
     * Flags the page for a human review (`reviewReason='manual'`, optional reason)
     * — spec 01 §11. Patches the browse row and re-counts the facets so the
     * "Needs review" preset and the queue pick it up without a reload.
     */
    requestReview(): Promise<void>;
    archive(): Promise<void>;
    openVersions(): void;
    onVersionRestored(document: IDocument): void;
    conflictReload(): Promise<void>;
    /** Duplicates the local (unsaved) content as a new PAGE sibling, then reloads. */
    conflictKeepCopy(): Promise<void>;
    back(): void;
    openBreadcrumb(node: IDocsTreeNode): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentPageComponent, "gz-docs-page", never, {}, {}, never, never, true, never>;
}
export {};
