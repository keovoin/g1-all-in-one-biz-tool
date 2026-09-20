import { OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IComment, ID, PermissionsEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ICommentDraft } from './comment-composer.component';
import { ICommentThreadNode, IMentionCandidate } from './document-comments.model';
import { DocumentCommentsService } from './document-comments.service';
import { MentionDirectoryService } from './mention-directory.service';
import * as i0 from "@angular/core";
/**
 * Document comment thread — the detail panel's Comments section.
 *
 * Documents adds no comment API of its own: this binds the platform's generic
 * `/api/comment` to `(BaseEntityEnum.Document, documentId)` (spec 08 §1), which
 * is where threading (`parentId`), resolve, `editedAt` and the mention
 * notification fan-out already live. There is no shared comment-thread component
 * in `ui-core` to reuse — `packages/ui-core` has no comment UI or service at all
 * (searched for comment/mention/thread), so the thread is built here.
 *
 * Permission model, read off the backend rather than assumed:
 *
 * - **Reading** follows document read access. `CommentController` is guarded by
 *   `TenantPermissionGuard`/`PermissionGuard` but declares no `@Permissions()`,
 *   so the API itself only requires tenant membership; the meaningful gate is
 *   that the panel renders only for a document the user can read (`DOCS_READ`).
 * - **Posting** needs no `DOCS_*` permission either — but `CommentService.create()`
 *   resolves the author from `RequestContext.currentEmployeeId()` and throws
 *   `NotFoundException` when that employee does not exist. A user without an
 *   employee record therefore *cannot* comment, so the composer is gated on
 *   having one and says why instead of failing on submit.
 * - **Editing and resolving** are 🛑 author-only: `CommentService.update()` matches
 *   `{ id, employeeId: currentEmployee }`, so a non-author's resolve is a 400,
 *   not a moderation action. The controls follow authorship, not a permission.
 * - **Deleting** goes through the tenant-scoped CRUD delete with no author check,
 *   so it is offered to the author and to `DOCS_MANAGE` holders (moderation).
 */
export declare class DocumentCommentsComponent extends TranslationBaseComponent implements OnChanges {
    readonly translateService: TranslateService;
    private readonly commentsService;
    private readonly directory;
    private readonly toastrService;
    private readonly store;
    documentId: ID;
    /** Document name — carried as `entityName` so the mention notification names the doc. */
    documentName?: string;
    private rootComposer?;
    nodes: ICommentThreadNode[];
    total: number;
    loading: boolean;
    loadError: boolean;
    /** Set of comment ids with a request in flight — one busy row never freezes the thread. */
    busyIds: Set<string>;
    posting: boolean;
    replyingTo: string | null;
    editingId: string | null;
    /** Mentions re-derived from the body being edited, so an edit does not un-mention anyone. */
    editingPicked: IMentionCandidate[];
    readonly permissions: typeof PermissionsEnum;
    constructor(translateService: TranslateService, commentsService: DocumentCommentsService, directory: MentionDirectoryService, toastrService: ToastrService, store: Store);
    ngOnChanges(changes: SimpleChanges): void;
    reload(): Promise<void>;
    get canRead(): boolean;
    /** The author id the API will stamp on anything posted from here. */
    get currentEmployeeId(): string | null;
    /** Posting needs a readable document AND an employee record — see the class doc. */
    get canComment(): boolean;
    /** True when the user may read but has no employee record to post as. */
    get commentingUnavailable(): boolean;
    isOwn(comment: IComment): boolean;
    /** Author-only: `CommentService.update()` filters by the current employee. */
    canEdit(comment: IComment): boolean;
    /** Resolve is an update, so it inherits the author-only rule above. */
    canResolve(comment: IComment): boolean;
    canDelete(comment: IComment): boolean;
    isBusy(comment: IComment): boolean;
    post(draft: ICommentDraft): Promise<void>;
    startReply(comment: IComment): void;
    cancelReply(): void;
    isReplying(comment: IComment): boolean;
    reply(parent: IComment, draft: ICommentDraft): Promise<void>;
    startEdit(comment: IComment): Promise<void>;
    cancelEdit(): void;
    isEditing(comment: IComment): boolean;
    saveEdit(comment: IComment, draft: ICommentDraft): Promise<void>;
    toggleResolved(comment: IComment): Promise<void>;
    remove(comment: IComment): Promise<void>;
    authorLabel(comment: IComment): string;
    /**
     * The readable body. Comments posted from the editor's block threads carry a
     * `[[block:…]]` marker as their first line (see `document-comments.model.ts`); this panel
     * shows the whole document's thread, so it must strip it rather than print machinery.
     */
    body(comment: IComment): string;
    /** True when the comment is anchored to an editor block rather than the document. */
    isBlockAnchored(comment: IComment): boolean;
    trackNode(_: number, node: ICommentThreadNode): string;
    trackComment(_: number, comment: IComment): string;
    /**
     * Re-threads the whole page after a change instead of splicing in place: the
     * grouping rules (orphan promotion, ordering) live in one function, and a
     * reply inserted by hand is exactly where they would drift apart.
     */
    private rebuild;
    private flatten;
    private insert;
    private replace;
    private drop;
    private markBusy;
    private createInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentCommentsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentCommentsComponent, "gz-docs-detail-comments", never, { "documentId": { "alias": "documentId"; "required": false; }; "documentName": { "alias": "documentName"; "required": false; }; }, {}, never, never, false, never>;
}
