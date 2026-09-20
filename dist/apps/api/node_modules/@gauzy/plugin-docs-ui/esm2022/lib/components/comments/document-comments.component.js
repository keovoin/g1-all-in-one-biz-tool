import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { BaseEntityEnum, PermissionsEnum } from '@gauzy/contracts';
import { EmployeesService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { CommentComposerComponent } from './comment-composer.component';
import { buildCommentThread, commentBlockId, commentBody, employeeMentionLabel, withBlockAnchor } from './document-comments.model';
import { DocumentCommentsService } from './document-comments.service';
import { MentionDirectoryService } from './mention-directory.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "./document-comments.service";
import * as i3 from "./mention-directory.service";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@angular/common";
import * as i6 from "@nebular/theme";
import * as i7 from "./comment-composer.component";
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
export class DocumentCommentsComponent extends TranslationBaseComponent {
    constructor(translateService, commentsService, directory, toastrService, store) {
        super(translateService);
        this.translateService = translateService;
        this.commentsService = commentsService;
        this.directory = directory;
        this.toastrService = toastrService;
        this.store = store;
        this.nodes = [];
        this.total = 0;
        this.loading = false;
        this.loadError = false;
        /** Set of comment ids with a request in flight — one busy row never freezes the thread. */
        this.busyIds = new Set();
        this.posting = false;
        this.replyingTo = null;
        this.editingId = null;
        /** Mentions re-derived from the body being edited, so an edit does not un-mention anyone. */
        this.editingPicked = [];
        this.permissions = PermissionsEnum;
    }
    ngOnChanges(changes) {
        if (changes['documentId'] && this.documentId) {
            this.replyingTo = null;
            this.editingId = null;
            void this.reload();
        }
    }
    // ─── Loading ─────────────────────────────────────────────────
    async reload() {
        if (!this.documentId)
            return;
        this.loading = true;
        this.loadError = false;
        try {
            const page = await firstValueFrom(this.commentsService.getAll(this.documentId));
            const items = page?.items ?? [];
            this.nodes = buildCommentThread(items);
            this.total = items.length;
        }
        catch {
            this.loadError = true;
            this.nodes = [];
            this.total = 0;
        }
        finally {
            this.loading = false;
        }
    }
    // ─── Permission gates ────────────────────────────────────────
    get canRead() {
        return this.store.hasPermission(PermissionsEnum.DOCS_READ);
    }
    /** The author id the API will stamp on anything posted from here. */
    get currentEmployeeId() {
        const user = this.store.user;
        const employeeId = user?.employee?.id ?? user?.employeeId;
        return employeeId ? String(employeeId) : null;
    }
    /** Posting needs a readable document AND an employee record — see the class doc. */
    get canComment() {
        return this.canRead && !!this.currentEmployeeId;
    }
    /** True when the user may read but has no employee record to post as. */
    get commentingUnavailable() {
        return this.canRead && !this.currentEmployeeId;
    }
    isOwn(comment) {
        const authorId = comment?.employeeId ?? comment?.employee?.id;
        return !!authorId && String(authorId) === this.currentEmployeeId;
    }
    /** Author-only: `CommentService.update()` filters by the current employee. */
    canEdit(comment) {
        return this.canComment && this.isOwn(comment);
    }
    /** Resolve is an update, so it inherits the author-only rule above. */
    canResolve(comment) {
        return this.canEdit(comment);
    }
    canDelete(comment) {
        return this.canComment && (this.isOwn(comment) || this.store.hasPermission(PermissionsEnum.DOCS_MANAGE));
    }
    isBusy(comment) {
        return this.busyIds.has(String(comment?.id));
    }
    // ─── Posting ─────────────────────────────────────────────────
    async post(draft) {
        if (!this.canComment || this.posting)
            return;
        this.posting = true;
        try {
            const comment = await firstValueFrom(this.commentsService.create(this.createInput(draft)));
            this.insert(comment);
            this.rootComposer?.reset();
            this.toastrService.success(this.getTranslation('DOCS.COMMENTS.TOAST_POSTED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.posting = false;
        }
    }
    startReply(comment) {
        this.replyingTo = String(comment.id);
        this.editingId = null;
    }
    cancelReply() {
        this.replyingTo = null;
    }
    isReplying(comment) {
        return this.replyingTo === String(comment.id);
    }
    async reply(parent, draft) {
        if (!this.canComment || this.isBusy(parent))
            return;
        this.markBusy(parent, true);
        try {
            const comment = await firstValueFrom(this.commentsService.create({ ...this.createInput(draft), parentId: parent.id }));
            this.insert(comment);
            this.replyingTo = null;
            this.toastrService.success(this.getTranslation('DOCS.COMMENTS.TOAST_POSTED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.markBusy(parent, false);
        }
    }
    // ─── Editing ─────────────────────────────────────────────────
    async startEdit(comment) {
        this.editingId = String(comment.id);
        this.replyingTo = null;
        // Seed the picks from the saved body — an edit re-sends the whole array. The block
        // anchor is stripped first: it is machinery, never part of the text being matched.
        this.editingPicked = await firstValueFrom(this.directory.matchInText(this.body(comment))).catch(() => []);
    }
    cancelEdit() {
        this.editingId = null;
        this.editingPicked = [];
    }
    isEditing(comment) {
        return this.editingId === String(comment.id);
    }
    async saveEdit(comment, draft) {
        if (!this.canEdit(comment) || this.isBusy(comment))
            return;
        this.markBusy(comment, true);
        try {
            const updated = await firstValueFrom(this.commentsService.update(comment.id, {
                // Re-stamp the anchor the composer never saw — an edit that dropped it
                // would silently detach the comment from its block.
                comment: withBlockAnchor(commentBlockId(comment), draft.comment),
                mentionEmployeeIds: draft.mentionEmployeeIds,
                editedAt: new Date()
            }));
            this.replace(comment, updated);
            this.cancelEdit();
            this.toastrService.success(this.getTranslation('DOCS.COMMENTS.TOAST_UPDATED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.markBusy(comment, false);
        }
    }
    // ─── Resolve / delete ────────────────────────────────────────
    async toggleResolved(comment) {
        if (!this.canResolve(comment) || this.isBusy(comment))
            return;
        const resolved = !comment.resolved;
        this.markBusy(comment, true);
        try {
            const updated = await firstValueFrom(this.commentsService.update(comment.id, {
                resolved,
                // The column is not derived server-side — an unresolve that left a
                // stale `resolvedAt` would read as "resolved" in every export.
                // `null` is the explicit clear; `resolvedAt` is typed `Date`, and
                // omitting it would leave the old timestamp in place.
                resolvedAt: resolved ? new Date() : null
            }));
            this.replace(comment, { ...updated, resolved });
            this.toastrService.success(this.getTranslation(resolved ? 'DOCS.COMMENTS.TOAST_RESOLVED' : 'DOCS.COMMENTS.TOAST_REOPENED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.markBusy(comment, false);
        }
    }
    async remove(comment) {
        if (!this.canDelete(comment) || this.isBusy(comment))
            return;
        this.markBusy(comment, true);
        try {
            await firstValueFrom(this.commentsService.delete(comment.id));
            this.drop(comment);
            this.toastrService.success(this.getTranslation('DOCS.COMMENTS.TOAST_DELETED'));
        }
        catch (error) {
            this.markBusy(comment, false);
            this.toastrService.danger(error);
        }
    }
    // ─── Presentation ────────────────────────────────────────────
    authorLabel(comment) {
        return employeeMentionLabel(comment?.employee) || this.getTranslation('DOCS.COMMENTS.UNKNOWN_AUTHOR');
    }
    /**
     * The readable body. Comments posted from the editor's block threads carry a
     * `[[block:…]]` marker as their first line (see `document-comments.model.ts`); this panel
     * shows the whole document's thread, so it must strip it rather than print machinery.
     */
    body(comment) {
        return commentBody(comment);
    }
    /** True when the comment is anchored to an editor block rather than the document. */
    isBlockAnchored(comment) {
        return !!commentBlockId(comment);
    }
    trackNode(_, node) {
        return String(node.comment.id);
    }
    trackComment(_, comment) {
        return String(comment.id);
    }
    // ─── Local thread mutation ───────────────────────────────────
    /**
     * Re-threads the whole page after a change instead of splicing in place: the
     * grouping rules (orphan promotion, ordering) live in one function, and a
     * reply inserted by hand is exactly where they would drift apart.
     */
    rebuild(comments) {
        this.nodes = buildCommentThread(comments);
        this.total = comments.length;
    }
    flatten() {
        return this.nodes.flatMap((node) => [node.comment, ...node.replies]);
    }
    insert(comment) {
        this.rebuild([...this.flatten(), comment]);
    }
    replace(previous, updated) {
        this.rebuild(this.flatten().map((entry) => String(entry.id) === String(previous.id) ? { ...entry, ...updated, id: previous.id } : entry));
    }
    drop(comment) {
        this.busyIds.delete(String(comment.id));
        this.rebuild(this.flatten().filter((entry) => String(entry.id) !== String(comment.id)));
    }
    markBusy(comment, busy) {
        const id = String(comment?.id);
        // A new Set keeps the template's `isBusy()` honest under OnPush parents.
        const next = new Set(this.busyIds);
        if (busy)
            next.add(id);
        else
            next.delete(id);
        this.busyIds = next;
    }
    createInput(draft) {
        return {
            entity: BaseEntityEnum.Document,
            entityId: this.documentId,
            entityName: this.documentName,
            comment: draft.comment,
            mentionEmployeeIds: draft.mentionEmployeeIds
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentCommentsComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentCommentsService }, { token: i3.MentionDirectoryService }, { token: i4.ToastrService }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentCommentsComponent, isStandalone: false, selector: "gz-docs-detail-comments", inputs: { documentId: "documentId", documentName: "documentName" }, providers: [DocumentCommentsService, MentionDirectoryService, EmployeesService], viewQueries: [{ propertyName: "rootComposer", first: true, predicate: ["rootComposer"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"gz-comments\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Error state \u2014 mirrors the panel's own retry affordance. -->\n\t<div class=\"gz-comments-error\" *ngIf=\"loadError\">\n\t\t<span>{{ 'DOCS.COMMENTS.LOAD_ERROR' | translate }}</span>\n\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"reload()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<!-- Empty state -->\n\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !nodes.length\">{{ 'DOCS.COMMENTS.EMPTY' | translate }}</p>\n\n\t<!-- Thread -->\n\t<ul class=\"gz-comments-list\" *ngIf=\"nodes.length\">\n\t\t<li class=\"gz-comment-node\" *ngFor=\"let node of nodes; trackBy: trackNode\">\n\t\t\t<ng-container\n\t\t\t\t*ngTemplateOutlet=\"commentBlock; context: { $implicit: node.comment, isReply: false }\"\n\t\t\t></ng-container>\n\n\t\t\t<ul class=\"gz-comment-replies\" *ngIf=\"node.replies.length\">\n\t\t\t\t<li *ngFor=\"let reply of node.replies; trackBy: trackComment\">\n\t\t\t\t\t<ng-container\n\t\t\t\t\t\t*ngTemplateOutlet=\"commentBlock; context: { $implicit: reply, isReply: true }\"\n\t\t\t\t\t></ng-container>\n\t\t\t\t</li>\n\t\t\t</ul>\n\n\t\t\t<!-- Reply box \u2014 only ever on a root, replies are single-level (parentId). -->\n\t\t\t<div class=\"gz-comment-reply-box\" *ngIf=\"isReplying(node.comment)\">\n\t\t\t\t<gz-docs-comment-composer\n\t\t\t\t\t[compact]=\"true\"\n\t\t\t\t\t[cancellable]=\"true\"\n\t\t\t\t\tplaceholderKey=\"DOCS.COMMENTS.REPLY_PLACEHOLDER\"\n\t\t\t\t\tsubmitLabelKey=\"DOCS.COMMENTS.REPLY\"\n\t\t\t\t\t[pending]=\"isBusy(node.comment)\"\n\t\t\t\t\t(submitted)=\"reply(node.comment, $event)\"\n\t\t\t\t\t(cancelled)=\"cancelReply()\"\n\t\t\t\t></gz-docs-comment-composer>\n\t\t\t</div>\n\t\t</li>\n\t</ul>\n\n\t<!-- New comment -->\n\t<div class=\"gz-comments-composer\" *ngIf=\"canComment\">\n\t\t<gz-docs-comment-composer\n\t\t\t#rootComposer\n\t\t\t[pending]=\"posting\"\n\t\t\t(submitted)=\"post($event)\"\n\t\t></gz-docs-comment-composer>\n\t</div>\n\t<p class=\"muted\" *ngIf=\"commentingUnavailable\">{{ 'DOCS.COMMENTS.NO_EMPLOYEE_RECORD' | translate }}</p>\n</div>\n\n<!-- One comment: header, body (or inline editor), actions. -->\n<ng-template #commentBlock let-comment let-isReply=\"isReply\">\n\t<article class=\"gz-comment\" [class.resolved]=\"comment.resolved\" [class.reply]=\"isReply\">\n\t\t<header class=\"gz-comment-head\">\n\t\t\t<span class=\"gz-comment-author\">{{ authorLabel(comment) }}</span>\n\t\t\t<span class=\"gz-comment-date\">{{ comment.createdAt | date : 'medium' }}</span>\n\t\t\t<span class=\"gz-comment-edited\" *ngIf=\"comment.editedAt\">{{ 'DOCS.COMMENTS.EDITED' | translate }}</span>\n\t\t\t<nb-badge\n\t\t\t\t*ngIf=\"comment.resolved\"\n\t\t\t\tstatus=\"success\"\n\t\t\t\t[text]=\"'DOCS.COMMENTS.RESOLVED' | translate\"\n\t\t\t></nb-badge>\n\t\t\t<!-- Posted from the editor's block thread \u2014 this panel shows the whole document. -->\n\t\t\t<span class=\"gz-comment-anchor\" *ngIf=\"isBlockAnchored(comment)\">\n\t\t\t\t<nb-icon icon=\"pin-outline\"></nb-icon>{{ 'DOCS.COMMENTS.ON_BLOCK' | translate }}\n\t\t\t</span>\n\t\t</header>\n\n\t\t<ng-container *ngIf=\"!isEditing(comment); else editor\">\n\t\t\t<p class=\"gz-comment-body\">{{ body(comment) }}</p>\n\n\t\t\t<div class=\"gz-comment-actions\">\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canComment && !isReply\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"startReply(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.COMMENTS.REPLY' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canResolve(comment)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"toggleResolved(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ (comment.resolved ? 'DOCS.COMMENTS.REOPEN' : 'DOCS.COMMENTS.RESOLVE') | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canEdit(comment)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"startEdit(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.COMMENTS.EDIT' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canDelete(comment)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"remove(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.COMMENTS.DELETE' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</ng-container>\n\n\t\t<ng-template #editor>\n\t\t\t<gz-docs-comment-composer\n\t\t\t\t[compact]=\"true\"\n\t\t\t\t[cancellable]=\"true\"\n\t\t\t\tsubmitLabelKey=\"DOCS.COMMENTS.SAVE\"\n\t\t\t\t[value]=\"body(comment)\"\n\t\t\t\t[picked]=\"editingPicked\"\n\t\t\t\t[pending]=\"isBusy(comment)\"\n\t\t\t\t(submitted)=\"saveEdit(comment, $event)\"\n\t\t\t\t(cancelled)=\"cancelEdit()\"\n\t\t\t></gz-docs-comment-composer>\n\t\t</ng-template>\n\t</article>\n</ng-template>\n", styles: [":host{display:block;min-width:0}.gz-comments{display:flex;flex-direction:column;gap:.75rem;min-height:3rem;min-width:0}.gz-comments .muted{color:var(--docs-text-muted, var(--text-hint-color));margin:0}.gz-comments button[nbButton]{display:inline-flex;align-items:center;gap:.25rem;height:1.5rem;min-height:1.5rem;padding-inline:.375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.gz-comments button[nbButton] nb-icon{margin:0;font-size:.875rem}.gz-comments-error{display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.gz-comments-list,.gz-comment-replies{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5rem}.gz-comment-replies{margin-top:.5rem;padding-inline-start:.75rem;border-inline-start:2px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.gz-comment{display:flex;flex-direction:column;gap:.25rem;font-size:var(--docs-body-size, .8125rem);min-width:0}.gz-comment.resolved{opacity:.65}.gz-comment-head{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap}.gz-comment-head .gz-comment-author{max-width:12rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.gz-comment-head .gz-comment-date,.gz-comment-head .gz-comment-edited{font-size:var(--docs-label-size, .6875rem);color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.gz-comment-head .gz-comment-anchor{display:inline-flex;align-items:center;gap:.125rem;font-size:var(--docs-label-size, .6875rem);color:var(--docs-text-muted, var(--text-hint-color))}.gz-comment-head .gz-comment-anchor nb-icon{font-size:.75rem}.gz-comment-head ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;transform:none}.gz-comment-body{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.gz-comment-actions{display:flex;align-items:center;gap:.125rem;flex-wrap:wrap}.gz-comment-reply-box{margin-top:.5rem;padding-inline-start:.75rem}.gz-comments-composer{padding-top:.25rem}\n"], dependencies: [{ kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i6.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i6.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i6.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i6.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i7.CommentComposerComponent, selector: "gz-docs-comment-composer", inputs: ["value", "picked", "placeholderKey", "submitLabelKey", "pending", "cancellable", "compact"], outputs: ["submitted", "cancelled"] }, { kind: "pipe", type: i5.DatePipe, name: "date" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentCommentsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-detail-comments', providers: [DocumentCommentsService, MentionDirectoryService, EmployeesService], standalone: false, template: "<div class=\"gz-comments\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Error state \u2014 mirrors the panel's own retry affordance. -->\n\t<div class=\"gz-comments-error\" *ngIf=\"loadError\">\n\t\t<span>{{ 'DOCS.COMMENTS.LOAD_ERROR' | translate }}</span>\n\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"reload()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<!-- Empty state -->\n\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !nodes.length\">{{ 'DOCS.COMMENTS.EMPTY' | translate }}</p>\n\n\t<!-- Thread -->\n\t<ul class=\"gz-comments-list\" *ngIf=\"nodes.length\">\n\t\t<li class=\"gz-comment-node\" *ngFor=\"let node of nodes; trackBy: trackNode\">\n\t\t\t<ng-container\n\t\t\t\t*ngTemplateOutlet=\"commentBlock; context: { $implicit: node.comment, isReply: false }\"\n\t\t\t></ng-container>\n\n\t\t\t<ul class=\"gz-comment-replies\" *ngIf=\"node.replies.length\">\n\t\t\t\t<li *ngFor=\"let reply of node.replies; trackBy: trackComment\">\n\t\t\t\t\t<ng-container\n\t\t\t\t\t\t*ngTemplateOutlet=\"commentBlock; context: { $implicit: reply, isReply: true }\"\n\t\t\t\t\t></ng-container>\n\t\t\t\t</li>\n\t\t\t</ul>\n\n\t\t\t<!-- Reply box \u2014 only ever on a root, replies are single-level (parentId). -->\n\t\t\t<div class=\"gz-comment-reply-box\" *ngIf=\"isReplying(node.comment)\">\n\t\t\t\t<gz-docs-comment-composer\n\t\t\t\t\t[compact]=\"true\"\n\t\t\t\t\t[cancellable]=\"true\"\n\t\t\t\t\tplaceholderKey=\"DOCS.COMMENTS.REPLY_PLACEHOLDER\"\n\t\t\t\t\tsubmitLabelKey=\"DOCS.COMMENTS.REPLY\"\n\t\t\t\t\t[pending]=\"isBusy(node.comment)\"\n\t\t\t\t\t(submitted)=\"reply(node.comment, $event)\"\n\t\t\t\t\t(cancelled)=\"cancelReply()\"\n\t\t\t\t></gz-docs-comment-composer>\n\t\t\t</div>\n\t\t</li>\n\t</ul>\n\n\t<!-- New comment -->\n\t<div class=\"gz-comments-composer\" *ngIf=\"canComment\">\n\t\t<gz-docs-comment-composer\n\t\t\t#rootComposer\n\t\t\t[pending]=\"posting\"\n\t\t\t(submitted)=\"post($event)\"\n\t\t></gz-docs-comment-composer>\n\t</div>\n\t<p class=\"muted\" *ngIf=\"commentingUnavailable\">{{ 'DOCS.COMMENTS.NO_EMPLOYEE_RECORD' | translate }}</p>\n</div>\n\n<!-- One comment: header, body (or inline editor), actions. -->\n<ng-template #commentBlock let-comment let-isReply=\"isReply\">\n\t<article class=\"gz-comment\" [class.resolved]=\"comment.resolved\" [class.reply]=\"isReply\">\n\t\t<header class=\"gz-comment-head\">\n\t\t\t<span class=\"gz-comment-author\">{{ authorLabel(comment) }}</span>\n\t\t\t<span class=\"gz-comment-date\">{{ comment.createdAt | date : 'medium' }}</span>\n\t\t\t<span class=\"gz-comment-edited\" *ngIf=\"comment.editedAt\">{{ 'DOCS.COMMENTS.EDITED' | translate }}</span>\n\t\t\t<nb-badge\n\t\t\t\t*ngIf=\"comment.resolved\"\n\t\t\t\tstatus=\"success\"\n\t\t\t\t[text]=\"'DOCS.COMMENTS.RESOLVED' | translate\"\n\t\t\t></nb-badge>\n\t\t\t<!-- Posted from the editor's block thread \u2014 this panel shows the whole document. -->\n\t\t\t<span class=\"gz-comment-anchor\" *ngIf=\"isBlockAnchored(comment)\">\n\t\t\t\t<nb-icon icon=\"pin-outline\"></nb-icon>{{ 'DOCS.COMMENTS.ON_BLOCK' | translate }}\n\t\t\t</span>\n\t\t</header>\n\n\t\t<ng-container *ngIf=\"!isEditing(comment); else editor\">\n\t\t\t<p class=\"gz-comment-body\">{{ body(comment) }}</p>\n\n\t\t\t<div class=\"gz-comment-actions\">\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canComment && !isReply\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"startReply(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.COMMENTS.REPLY' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canResolve(comment)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"toggleResolved(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ (comment.resolved ? 'DOCS.COMMENTS.REOPEN' : 'DOCS.COMMENTS.RESOLVE') | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canEdit(comment)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"startEdit(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.COMMENTS.EDIT' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"canDelete(comment)\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[disabled]=\"isBusy(comment)\"\n\t\t\t\t\t(click)=\"remove(comment)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.COMMENTS.DELETE' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</ng-container>\n\n\t\t<ng-template #editor>\n\t\t\t<gz-docs-comment-composer\n\t\t\t\t[compact]=\"true\"\n\t\t\t\t[cancellable]=\"true\"\n\t\t\t\tsubmitLabelKey=\"DOCS.COMMENTS.SAVE\"\n\t\t\t\t[value]=\"body(comment)\"\n\t\t\t\t[picked]=\"editingPicked\"\n\t\t\t\t[pending]=\"isBusy(comment)\"\n\t\t\t\t(submitted)=\"saveEdit(comment, $event)\"\n\t\t\t\t(cancelled)=\"cancelEdit()\"\n\t\t\t></gz-docs-comment-composer>\n\t\t</ng-template>\n\t</article>\n</ng-template>\n", styles: [":host{display:block;min-width:0}.gz-comments{display:flex;flex-direction:column;gap:.75rem;min-height:3rem;min-width:0}.gz-comments .muted{color:var(--docs-text-muted, var(--text-hint-color));margin:0}.gz-comments button[nbButton]{display:inline-flex;align-items:center;gap:.25rem;height:1.5rem;min-height:1.5rem;padding-inline:.375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.gz-comments button[nbButton] nb-icon{margin:0;font-size:.875rem}.gz-comments-error{display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.gz-comments-list,.gz-comment-replies{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5rem}.gz-comment-replies{margin-top:.5rem;padding-inline-start:.75rem;border-inline-start:2px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.gz-comment{display:flex;flex-direction:column;gap:.25rem;font-size:var(--docs-body-size, .8125rem);min-width:0}.gz-comment.resolved{opacity:.65}.gz-comment-head{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap}.gz-comment-head .gz-comment-author{max-width:12rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.gz-comment-head .gz-comment-date,.gz-comment-head .gz-comment-edited{font-size:var(--docs-label-size, .6875rem);color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap}.gz-comment-head .gz-comment-anchor{display:inline-flex;align-items:center;gap:.125rem;font-size:var(--docs-label-size, .6875rem);color:var(--docs-text-muted, var(--text-hint-color))}.gz-comment-head .gz-comment-anchor nb-icon{font-size:.75rem}.gz-comment-head ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;transform:none}.gz-comment-body{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.gz-comment-actions{display:flex;align-items:center;gap:.125rem;flex-wrap:wrap}.gz-comment-reply-box{margin-top:.5rem;padding-inline-start:.75rem}.gz-comments-composer{padding-top:.25rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentCommentsService }, { type: i3.MentionDirectoryService }, { type: i4.ToastrService }, { type: i4.Store }], propDecorators: { documentId: [{
                type: Input
            }], documentName: [{
                type: Input
            }], rootComposer: [{
                type: ViewChild,
                args: ['rootComposer']
            }] } });
//# sourceMappingURL=document-comments.component.js.map