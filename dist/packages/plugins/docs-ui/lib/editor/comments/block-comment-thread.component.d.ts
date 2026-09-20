import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IComment, ID } from '@gauzy/contracts';
import { ICommentThreadNode, IMentionCandidate } from '../../components/comments/document-comments.model';
import * as i0 from "@angular/core";
/** One block's thread, plus whether the block still exists in the document. */
export interface IBlockThread {
    blockId: string;
    nodes: ICommentThreadNode[];
    /** Open comment count — what the rail badge and the editor gutter both key off. */
    openCount: number;
    /** The anchored block was deleted from the document; the thread survives (spec 05 §8). */
    detached: boolean;
}
/**
 * Block-anchored comment threads (spec 05 §8) — the page editor's Comments rail.
 *
 * **Standalone on purpose.** `DocumentPageComponent` is a standalone component behind
 * `loadComponent`, and `DocumentCommentsComponent` is declared in `docs-ui.module.ts`; making
 * this one standalone lets the page mount it without an NgModule edit.
 *
 * Anchoring rides in the comment body's first line rather than in a `metadata` column — the
 * platform `Comment` entity has none, and its whitelisting DTO drops unknown properties (the
 * full reasoning is on `BLOCK_ANCHOR_PATTERN`). Everything else — threading, resolve, the
 * mention fan-out — is the platform's generic `/api/comment`, exactly as the detail panel's
 * document-level thread uses it.
 */
export declare class BlockCommentThreadComponent implements OnChanges {
    documentId: ID;
    /** Carried as `entityName` so the mention notification names the document. */
    documentName?: string;
    /** The block whose thread is expanded; `null` lists every anchored thread. */
    blockId: string | null;
    /** `blockId`s currently present in the document — anything else is a detached thread. */
    knownBlockIds: readonly string[] | null;
    /** Anchors with at least one unresolved comment — feeds the editor's gutter decorations. */
    openBlocksChanged: EventEmitter<string[]>;
    /** The user asked to jump to a block (thread header click). */
    blockFocused: EventEmitter<string>;
    private composerRef?;
    private readonly commentsService;
    private readonly directory;
    private readonly toastrService;
    private readonly translate;
    private readonly store;
    private readonly changeDetectorRef;
    threads: IBlockThread[];
    loading: boolean;
    loadError: boolean;
    posting: boolean;
    busyIds: Set<string>;
    /** Composer state — a deliberately small copy of `CommentComposerComponent` (NgModule-declared). */
    draft: string;
    suggestions: IMentionCandidate[];
    activeIndex: number;
    mentionsOpen: boolean;
    private mentioned;
    private token;
    private sequence;
    /** Every comment on the document, block-anchored or not — the grouping source. */
    private all;
    ngOnChanges(changes: SimpleChanges): void;
    reload(): Promise<void>;
    get currentEmployeeId(): string | null;
    get canComment(): boolean;
    isOwn(comment: IComment): boolean;
    /** 🛑 `CommentService.update()` matches on `{ id, employeeId }` — resolve is author-only. */
    canResolve(comment: IComment): boolean;
    isBusy(comment: IComment): boolean;
    authorLabel(comment: IComment): string;
    body(comment: IComment): string;
    trackThread(_: number, thread: IBlockThread): string;
    trackNode(_: number, node: ICommentThreadNode): string;
    trackComment(_: number, comment: IComment): string;
    focusBlock(thread: IBlockThread): void;
    get canSubmit(): boolean;
    post(): Promise<void>;
    toggleResolved(comment: IComment): Promise<void>;
    onInput(event: Event): Promise<void>;
    onKeyDown(event: KeyboardEvent): void;
    /** `mousedown`, not `click`: the textarea's blur would close the menu first. */
    pick(candidate?: IMentionCandidate, event?: Event): void;
    closeMentions(): void;
    /**
     * Rebuilds the block groups from the loaded page and republishes the open-anchor set.
     *
     * `knownBlockIds` is only trusted when it is actually supplied: before the editor has
     * reported its blocks, treating "not in the list" as "deleted" would flag every thread
     * as detached.
     */
    private regroup;
    private resetComposer;
    private markBusy;
    static ɵfac: i0.ɵɵFactoryDeclaration<BlockCommentThreadComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BlockCommentThreadComponent, "gz-docs-block-comments", never, { "documentId": { "alias": "documentId"; "required": false; }; "documentName": { "alias": "documentName"; "required": false; }; "blockId": { "alias": "blockId"; "required": false; }; "knownBlockIds": { "alias": "knownBlockIds"; "required": false; }; }, { "openBlocksChanged": "openBlocksChanged"; "blockFocused": "blockFocused"; }, never, never, true, never>;
}
