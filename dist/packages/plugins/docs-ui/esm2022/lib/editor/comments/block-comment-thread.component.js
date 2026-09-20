import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { NbBadgeModule, NbButtonModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { BaseEntityEnum, PermissionsEnum } from '@gauzy/contracts';
import { EmployeesService, Store, ToastrService } from '@gauzy/ui-core/core';
import { applyMentionPick, buildCommentThread, collectMentionEmployeeIds, commentBody, detectMentionToken, employeeMentionLabel, groupCommentsByBlock, openBlockAnchors, withBlockAnchor } from '../../components/comments/document-comments.model';
import { DocumentCommentsService } from '../../components/comments/document-comments.service';
import { MentionDirectoryService } from '../../components/comments/mention-directory.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
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
export class BlockCommentThreadComponent {
    constructor() {
        /** The block whose thread is expanded; `null` lists every anchored thread. */
        this.blockId = null;
        /** `blockId`s currently present in the document — anything else is a detached thread. */
        this.knownBlockIds = null;
        /** Anchors with at least one unresolved comment — feeds the editor's gutter decorations. */
        this.openBlocksChanged = new EventEmitter();
        /** The user asked to jump to a block (thread header click). */
        this.blockFocused = new EventEmitter();
        this.commentsService = inject(DocumentCommentsService);
        this.directory = inject(MentionDirectoryService);
        this.toastrService = inject(ToastrService);
        this.translate = inject(TranslateService);
        this.store = inject(Store);
        this.changeDetectorRef = inject(ChangeDetectorRef);
        this.threads = [];
        this.loading = false;
        this.loadError = false;
        this.posting = false;
        this.busyIds = new Set();
        /** Composer state — a deliberately small copy of `CommentComposerComponent` (NgModule-declared). */
        this.draft = '';
        this.suggestions = [];
        this.activeIndex = 0;
        this.mentionsOpen = false;
        this.mentioned = [];
        this.token = null;
        this.sequence = 0;
        /** Every comment on the document, block-anchored or not — the grouping source. */
        this.all = [];
    }
    ngOnChanges(changes) {
        if (changes['documentId'] && this.documentId) {
            void this.reload();
            return;
        }
        // A block came into (or left) focus, or the document's block set changed after an
        // edit — regroup from what is already loaded rather than re-fetching.
        if (changes['blockId'] || changes['knownBlockIds'])
            this.regroup();
    }
    // ─── Loading ─────────────────────────────────────────────────
    async reload() {
        if (!this.documentId)
            return;
        this.loading = true;
        this.loadError = false;
        this.changeDetectorRef.markForCheck();
        try {
            const page = await firstValueFrom(this.commentsService.getAll(this.documentId));
            this.all = page?.items ?? [];
            this.regroup();
        }
        catch {
            this.loadError = true;
            this.all = [];
            this.threads = [];
        }
        finally {
            this.loading = false;
            this.changeDetectorRef.markForCheck();
        }
    }
    // ─── Permission gates (identical rules to the document-level thread) ──
    get currentEmployeeId() {
        const user = this.store.user;
        const employeeId = user?.employee?.id ?? user?.employeeId;
        return employeeId ? String(employeeId) : null;
    }
    get canComment() {
        return this.store.hasPermission(PermissionsEnum.DOCS_READ) && !!this.currentEmployeeId;
    }
    isOwn(comment) {
        const authorId = comment?.employeeId ?? comment?.employee?.id;
        return !!authorId && String(authorId) === this.currentEmployeeId;
    }
    /** 🛑 `CommentService.update()` matches on `{ id, employeeId }` — resolve is author-only. */
    canResolve(comment) {
        return this.canComment && this.isOwn(comment);
    }
    isBusy(comment) {
        return this.busyIds.has(String(comment?.id));
    }
    // ─── Presentation ────────────────────────────────────────────
    authorLabel(comment) {
        return employeeMentionLabel(comment?.employee) || this.translate.instant('DOCS.COMMENTS.UNKNOWN_AUTHOR');
    }
    body(comment) {
        return commentBody(comment);
    }
    trackThread(_, thread) {
        return thread.blockId;
    }
    trackNode(_, node) {
        return String(node.comment.id);
    }
    trackComment(_, comment) {
        return String(comment.id);
    }
    focusBlock(thread) {
        if (!thread.detached)
            this.blockFocused.emit(thread.blockId);
    }
    // ─── Posting ─────────────────────────────────────────────────
    get canSubmit() {
        return !this.posting && !!this.blockId && this.draft.trim().length > 0;
    }
    async post() {
        if (!this.canSubmit || !this.canComment)
            return;
        const text = this.draft.trim();
        this.posting = true;
        this.changeDetectorRef.markForCheck();
        try {
            const created = await firstValueFrom(this.commentsService.create({
                entity: BaseEntityEnum.Document,
                entityId: this.documentId,
                entityName: this.documentName,
                // The anchor is the first line of the body — see `withBlockAnchor`.
                comment: withBlockAnchor(this.blockId, text),
                mentionEmployeeIds: collectMentionEmployeeIds(text, this.mentioned)
            }));
            this.all = [...this.all, created];
            this.resetComposer();
            this.regroup();
            this.toastrService.success(this.translate.instant('DOCS.COMMENTS.TOAST_POSTED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.posting = false;
            this.changeDetectorRef.markForCheck();
        }
    }
    async toggleResolved(comment) {
        if (!this.canResolve(comment) || this.isBusy(comment))
            return;
        const resolved = !comment.resolved;
        this.markBusy(comment, true);
        try {
            await firstValueFrom(this.commentsService.update(comment.id, {
                resolved,
                // Not derived server-side — an unresolve that left `resolvedAt` behind
                // reads as "resolved" in every export.
                resolvedAt: resolved ? new Date() : null
            }));
            this.all = this.all.map((entry) => String(entry.id) === String(comment.id) ? { ...entry, resolved } : entry);
            this.regroup();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.markBusy(comment, false);
        }
    }
    // ─── Composer (`@` mentions) ─────────────────────────────────
    async onInput(event) {
        const target = event.target;
        this.draft = target.value;
        this.token = detectMentionToken(this.draft, target.selectionStart ?? this.draft.length);
        if (!this.token) {
            this.closeMentions();
            return;
        }
        const mySequence = ++this.sequence;
        const candidates = await firstValueFrom(this.directory.search(this.token.query));
        if (mySequence !== this.sequence || !this.token)
            return;
        this.suggestions = candidates;
        this.activeIndex = 0;
        this.mentionsOpen = candidates.length > 0;
        this.changeDetectorRef.markForCheck();
    }
    onKeyDown(event) {
        if (this.mentionsOpen && this.suggestions.length) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                this.activeIndex = (this.activeIndex + 1) % this.suggestions.length;
                return;
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                this.activeIndex = (this.activeIndex - 1 + this.suggestions.length) % this.suggestions.length;
                return;
            }
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault();
                this.pick(this.suggestions[this.activeIndex]);
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                this.closeMentions();
                return;
            }
        }
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            void this.post();
        }
    }
    /** `mousedown`, not `click`: the textarea's blur would close the menu first. */
    pick(candidate, event) {
        event?.preventDefault();
        if (!candidate || !this.token)
            return;
        const element = this.composerRef?.nativeElement;
        const caret = element?.selectionStart ?? this.draft.length;
        const applied = applyMentionPick(this.draft, this.token, caret, candidate.label);
        this.draft = applied.text;
        if (!this.mentioned.some((entry) => String(entry.id) === String(candidate.id))) {
            this.mentioned = [...this.mentioned, candidate];
        }
        this.closeMentions();
        if (element) {
            element.value = this.draft;
            element.focus();
            element.setSelectionRange(applied.caret, applied.caret);
        }
    }
    closeMentions() {
        this.mentionsOpen = false;
        this.suggestions = [];
        this.activeIndex = 0;
        this.token = null;
        this.changeDetectorRef.markForCheck();
    }
    // ─── Internals ───────────────────────────────────────────────
    /**
     * Rebuilds the block groups from the loaded page and republishes the open-anchor set.
     *
     * `knownBlockIds` is only trusted when it is actually supplied: before the editor has
     * reported its blocks, treating "not in the list" as "deleted" would flag every thread
     * as detached.
     */
    regroup() {
        const known = this.knownBlockIds?.length ? new Set(this.knownBlockIds.map(String)) : null;
        const grouped = groupCommentsByBlock(this.all);
        const focused = this.blockId ? String(this.blockId) : null;
        // A focused block with no comments yet still gets an (empty) thread so the composer
        // has something to sit under.
        if (focused && !grouped.has(focused))
            grouped.set(focused, []);
        this.threads = [...grouped]
            .filter(([blockId]) => !focused || blockId === focused)
            .map(([blockId, comments]) => ({
            blockId,
            nodes: buildCommentThread(comments),
            openCount: comments.filter((comment) => !comment.resolved).length,
            detached: !!known && !known.has(blockId)
        }));
        this.openBlocksChanged.emit(openBlockAnchors(this.all));
        this.changeDetectorRef.markForCheck();
    }
    resetComposer() {
        this.draft = '';
        this.mentioned = [];
        this.closeMentions();
    }
    markBusy(comment, busy) {
        const id = String(comment?.id);
        // A new Set keeps `isBusy()` honest under OnPush.
        const next = new Set(this.busyIds);
        if (busy)
            next.add(id);
        else
            next.delete(id);
        this.busyIds = next;
        this.changeDetectorRef.markForCheck();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BlockCommentThreadComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: BlockCommentThreadComponent, isStandalone: true, selector: "gz-docs-block-comments", inputs: { documentId: "documentId", documentName: "documentName", blockId: "blockId", knownBlockIds: "knownBlockIds" }, outputs: { openBlocksChanged: "openBlocksChanged", blockFocused: "blockFocused" }, providers: [DocumentCommentsService, MentionDirectoryService, EmployeesService], viewQueries: [{ propertyName: "composerRef", first: true, predicate: ["composerInput"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"gz-block-comments\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Load failure \u2014 same retry affordance as the detail panel's thread. -->\n\t<div class=\"gz-block-comments-error\" *ngIf=\"loadError\">\n\t\t<span>{{ 'DOCS.COMMENTS.LOAD_ERROR' | translate }}</span>\n\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"reload()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<!-- Nothing anchored anywhere, and no block picked. -->\n\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !threads.length\">\n\t\t{{ 'DOCS.COMMENTS.BLOCK_EMPTY' | translate }}\n\t</p>\n\n\t<section class=\"gz-block-thread\" *ngFor=\"let thread of threads; trackBy: trackThread\">\n\t\t<header class=\"gz-block-thread-head\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"tiny\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[disabled]=\"thread.detached\"\n\t\t\t\t(click)=\"focusBlock(thread)\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"pin-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.COMMENTS.BLOCK_THREAD' | translate }}\n\t\t\t</button>\n\t\t\t<nb-badge *ngIf=\"thread.openCount\" status=\"info\" [text]=\"thread.openCount.toString()\"></nb-badge>\n\t\t\t<!-- The anchored block was deleted; the thread stays readable (spec 05 \u00A78). -->\n\t\t\t<span class=\"gz-block-detached\" *ngIf=\"thread.detached\">\n\t\t\t\t{{ 'DOCS.EDITOR.COMMENT.DETACHED' | translate }}\n\t\t\t</span>\n\t\t</header>\n\n\t\t<ul class=\"gz-block-comments-list\">\n\t\t\t<li *ngFor=\"let node of thread.nodes; trackBy: trackNode\">\n\t\t\t\t<ng-container *ngTemplateOutlet=\"commentBlock; context: { $implicit: node.comment }\"></ng-container>\n\t\t\t\t<ul class=\"gz-block-comment-replies\" *ngIf=\"node.replies.length\">\n\t\t\t\t\t<li *ngFor=\"let reply of node.replies; trackBy: trackComment\">\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"commentBlock; context: { $implicit: reply }\"></ng-container>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\t\t</ul>\n\t</section>\n\n\t<!-- Composer \u2014 a comment always belongs to a specific block, so it needs one in focus. -->\n\t<div class=\"gz-block-composer\" *ngIf=\"blockId && canComment\">\n\t\t<textarea\n\t\t\t#composerInput\n\t\t\tnbInput\n\t\t\tfullWidth\n\t\t\tfieldSize=\"small\"\n\t\t\trows=\"3\"\n\t\t\t[value]=\"draft\"\n\t\t\t[disabled]=\"posting\"\n\t\t\t[placeholder]=\"'DOCS.COMMENTS.PLACEHOLDER' | translate\"\n\t\t\t[attr.aria-label]=\"'DOCS.COMMENTS.PLACEHOLDER' | translate\"\n\t\t\t(input)=\"onInput($event)\"\n\t\t\t(keydown)=\"onKeyDown($event)\"\n\t\t\t(blur)=\"closeMentions()\"\n\t\t></textarea>\n\n\t\t<ul\n\t\t\tclass=\"gz-block-mentions\"\n\t\t\t*ngIf=\"mentionsOpen && suggestions.length\"\n\t\t\trole=\"listbox\"\n\t\t\t[attr.aria-label]=\"'DOCS.COMMENTS.MENTION_ARIA' | translate\"\n\t\t>\n\t\t\t<li *ngFor=\"let candidate of suggestions; let index = index\">\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\trole=\"option\"\n\t\t\t\t\t[attr.aria-selected]=\"index === activeIndex\"\n\t\t\t\t\t[class.active]=\"index === activeIndex\"\n\t\t\t\t\t(mousedown)=\"pick(candidate, $event)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t\t\t\t<span>{{ candidate.label }}</span>\n\t\t\t\t</button>\n\t\t\t</li>\n\t\t</ul>\n\n\t\t<div class=\"gz-block-composer-actions\">\n\t\t\t<span class=\"gz-block-hint\">{{ 'DOCS.COMMENTS.MENTION_HINT' | translate }}</span>\n\t\t\t<button nbButton status=\"primary\" size=\"tiny\" type=\"button\" [disabled]=\"!canSubmit\" (click)=\"post()\">\n\t\t\t\t{{ 'DOCS.COMMENTS.POST' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</div>\n\n\t<p class=\"muted\" *ngIf=\"blockId && !canComment\">{{ 'DOCS.COMMENTS.NO_EMPLOYEE_RECORD' | translate }}</p>\n\t<p class=\"muted\" *ngIf=\"!blockId && threads.length\">{{ 'DOCS.COMMENTS.BLOCK_PICK_HINT' | translate }}</p>\n</div>\n\n<!-- One comment: author, date, body, resolve toggle. -->\n<ng-template #commentBlock let-comment>\n\t<article class=\"gz-block-comment\" [class.resolved]=\"comment.resolved\">\n\t\t<header class=\"gz-block-comment-head\">\n\t\t\t<span class=\"gz-block-comment-author\">{{ authorLabel(comment) }}</span>\n\t\t\t<span class=\"gz-block-comment-date\">{{ comment.createdAt | date : 'short' }}</span>\n\t\t\t<nb-badge\n\t\t\t\t*ngIf=\"comment.resolved\"\n\t\t\t\tstatus=\"success\"\n\t\t\t\t[text]=\"'DOCS.COMMENTS.RESOLVED' | translate\"\n\t\t\t></nb-badge>\n\t\t</header>\n\t\t<p class=\"gz-block-comment-body\">{{ body(comment) }}</p>\n\t\t<div class=\"gz-block-comment-actions\" *ngIf=\"canResolve(comment)\">\n\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" [disabled]=\"isBusy(comment)\" (click)=\"toggleResolved(comment)\">\n\t\t\t\t{{ (comment.resolved ? 'DOCS.COMMENTS.REOPEN' : 'DOCS.COMMENTS.RESOLVE') | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</article>\n</ng-template>\n", styles: [".gz-block-comments{display:flex;flex-direction:column;gap:.75rem;min-height:3rem;font-size:.8125rem}.gz-block-comments .muted{margin:0;color:var(--text-hint-color)}.gz-block-comments-error{display:flex;align-items:center;gap:.5rem;color:var(--text-hint-color)}.gz-block-thread{display:flex;flex-direction:column;gap:.375rem;padding-bottom:.5rem;border-bottom:1px solid var(--border-basic-color-3)}.gz-block-thread:last-of-type{border-bottom:0}.gz-block-thread-head{display:flex;align-items:center;gap:.25rem;flex-wrap:wrap}.gz-block-detached{font-size:.6875rem;color:var(--text-hint-color);font-style:italic}.gz-block-comments-list,.gz-block-comment-replies{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5rem}.gz-block-comment-replies{margin-top:.5rem;padding-left:.75rem;border-left:2px solid var(--border-basic-color-3)}.gz-block-comment{display:flex;flex-direction:column;gap:.125rem}.gz-block-comment.resolved{opacity:.65}.gz-block-comment-head{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap}.gz-block-comment-head .gz-block-comment-author{font-weight:600}.gz-block-comment-head .gz-block-comment-date{font-size:.6875rem;color:var(--text-hint-color)}.gz-block-comment-body{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.gz-block-comment-actions{display:flex;align-items:center;gap:.125rem}.gz-block-composer{position:relative;display:flex;flex-direction:column;gap:.375rem}.gz-block-composer textarea{resize:vertical}.gz-block-composer-actions{display:flex;align-items:center;gap:.375rem}.gz-block-hint{flex:1 1 auto;font-size:.6875rem;color:var(--text-hint-color)}.gz-block-mentions{position:absolute;z-index:10;top:100%;left:0;right:0;margin:.125rem 0 0;padding:.25rem;list-style:none;max-height:12rem;overflow-y:auto;border:1px solid var(--border-basic-color-3);border-radius:.375rem;background:var(--background-basic-color-1);box-shadow:0 .5rem 1rem #0000001f}.gz-block-mentions button{display:flex;align-items:center;gap:.375rem;width:100%;padding:.25rem .375rem;border:0;border-radius:.25rem;background:transparent;color:var(--text-basic-color);font:inherit;text-align:left;cursor:pointer}.gz-block-mentions button:hover,.gz-block-mentions button.active{background:var(--background-basic-color-2)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbBadgeModule }, { kind: "component", type: i2.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "pipe", type: i1.DatePipe, name: "date" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BlockCommentThreadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-block-comments', standalone: true, imports: [
                        CommonModule,
                        TranslateModule,
                        NbBadgeModule,
                        NbButtonModule,
                        NbIconModule,
                        NbInputModule,
                        NbSpinnerModule
                    ], changeDetection: ChangeDetectionStrategy.OnPush, providers: [DocumentCommentsService, MentionDirectoryService, EmployeesService], template: "<div class=\"gz-block-comments\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Load failure \u2014 same retry affordance as the detail panel's thread. -->\n\t<div class=\"gz-block-comments-error\" *ngIf=\"loadError\">\n\t\t<span>{{ 'DOCS.COMMENTS.LOAD_ERROR' | translate }}</span>\n\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"reload()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<!-- Nothing anchored anywhere, and no block picked. -->\n\t<p class=\"muted\" *ngIf=\"!loading && !loadError && !threads.length\">\n\t\t{{ 'DOCS.COMMENTS.BLOCK_EMPTY' | translate }}\n\t</p>\n\n\t<section class=\"gz-block-thread\" *ngFor=\"let thread of threads; trackBy: trackThread\">\n\t\t<header class=\"gz-block-thread-head\">\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"tiny\"\n\t\t\t\ttype=\"button\"\n\t\t\t\t[disabled]=\"thread.detached\"\n\t\t\t\t(click)=\"focusBlock(thread)\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"pin-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.COMMENTS.BLOCK_THREAD' | translate }}\n\t\t\t</button>\n\t\t\t<nb-badge *ngIf=\"thread.openCount\" status=\"info\" [text]=\"thread.openCount.toString()\"></nb-badge>\n\t\t\t<!-- The anchored block was deleted; the thread stays readable (spec 05 \u00A78). -->\n\t\t\t<span class=\"gz-block-detached\" *ngIf=\"thread.detached\">\n\t\t\t\t{{ 'DOCS.EDITOR.COMMENT.DETACHED' | translate }}\n\t\t\t</span>\n\t\t</header>\n\n\t\t<ul class=\"gz-block-comments-list\">\n\t\t\t<li *ngFor=\"let node of thread.nodes; trackBy: trackNode\">\n\t\t\t\t<ng-container *ngTemplateOutlet=\"commentBlock; context: { $implicit: node.comment }\"></ng-container>\n\t\t\t\t<ul class=\"gz-block-comment-replies\" *ngIf=\"node.replies.length\">\n\t\t\t\t\t<li *ngFor=\"let reply of node.replies; trackBy: trackComment\">\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"commentBlock; context: { $implicit: reply }\"></ng-container>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\t\t</ul>\n\t</section>\n\n\t<!-- Composer \u2014 a comment always belongs to a specific block, so it needs one in focus. -->\n\t<div class=\"gz-block-composer\" *ngIf=\"blockId && canComment\">\n\t\t<textarea\n\t\t\t#composerInput\n\t\t\tnbInput\n\t\t\tfullWidth\n\t\t\tfieldSize=\"small\"\n\t\t\trows=\"3\"\n\t\t\t[value]=\"draft\"\n\t\t\t[disabled]=\"posting\"\n\t\t\t[placeholder]=\"'DOCS.COMMENTS.PLACEHOLDER' | translate\"\n\t\t\t[attr.aria-label]=\"'DOCS.COMMENTS.PLACEHOLDER' | translate\"\n\t\t\t(input)=\"onInput($event)\"\n\t\t\t(keydown)=\"onKeyDown($event)\"\n\t\t\t(blur)=\"closeMentions()\"\n\t\t></textarea>\n\n\t\t<ul\n\t\t\tclass=\"gz-block-mentions\"\n\t\t\t*ngIf=\"mentionsOpen && suggestions.length\"\n\t\t\trole=\"listbox\"\n\t\t\t[attr.aria-label]=\"'DOCS.COMMENTS.MENTION_ARIA' | translate\"\n\t\t>\n\t\t\t<li *ngFor=\"let candidate of suggestions; let index = index\">\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\trole=\"option\"\n\t\t\t\t\t[attr.aria-selected]=\"index === activeIndex\"\n\t\t\t\t\t[class.active]=\"index === activeIndex\"\n\t\t\t\t\t(mousedown)=\"pick(candidate, $event)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t\t\t\t<span>{{ candidate.label }}</span>\n\t\t\t\t</button>\n\t\t\t</li>\n\t\t</ul>\n\n\t\t<div class=\"gz-block-composer-actions\">\n\t\t\t<span class=\"gz-block-hint\">{{ 'DOCS.COMMENTS.MENTION_HINT' | translate }}</span>\n\t\t\t<button nbButton status=\"primary\" size=\"tiny\" type=\"button\" [disabled]=\"!canSubmit\" (click)=\"post()\">\n\t\t\t\t{{ 'DOCS.COMMENTS.POST' | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</div>\n\n\t<p class=\"muted\" *ngIf=\"blockId && !canComment\">{{ 'DOCS.COMMENTS.NO_EMPLOYEE_RECORD' | translate }}</p>\n\t<p class=\"muted\" *ngIf=\"!blockId && threads.length\">{{ 'DOCS.COMMENTS.BLOCK_PICK_HINT' | translate }}</p>\n</div>\n\n<!-- One comment: author, date, body, resolve toggle. -->\n<ng-template #commentBlock let-comment>\n\t<article class=\"gz-block-comment\" [class.resolved]=\"comment.resolved\">\n\t\t<header class=\"gz-block-comment-head\">\n\t\t\t<span class=\"gz-block-comment-author\">{{ authorLabel(comment) }}</span>\n\t\t\t<span class=\"gz-block-comment-date\">{{ comment.createdAt | date : 'short' }}</span>\n\t\t\t<nb-badge\n\t\t\t\t*ngIf=\"comment.resolved\"\n\t\t\t\tstatus=\"success\"\n\t\t\t\t[text]=\"'DOCS.COMMENTS.RESOLVED' | translate\"\n\t\t\t></nb-badge>\n\t\t</header>\n\t\t<p class=\"gz-block-comment-body\">{{ body(comment) }}</p>\n\t\t<div class=\"gz-block-comment-actions\" *ngIf=\"canResolve(comment)\">\n\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" [disabled]=\"isBusy(comment)\" (click)=\"toggleResolved(comment)\">\n\t\t\t\t{{ (comment.resolved ? 'DOCS.COMMENTS.REOPEN' : 'DOCS.COMMENTS.RESOLVE') | translate }}\n\t\t\t</button>\n\t\t</div>\n\t</article>\n</ng-template>\n", styles: [".gz-block-comments{display:flex;flex-direction:column;gap:.75rem;min-height:3rem;font-size:.8125rem}.gz-block-comments .muted{margin:0;color:var(--text-hint-color)}.gz-block-comments-error{display:flex;align-items:center;gap:.5rem;color:var(--text-hint-color)}.gz-block-thread{display:flex;flex-direction:column;gap:.375rem;padding-bottom:.5rem;border-bottom:1px solid var(--border-basic-color-3)}.gz-block-thread:last-of-type{border-bottom:0}.gz-block-thread-head{display:flex;align-items:center;gap:.25rem;flex-wrap:wrap}.gz-block-detached{font-size:.6875rem;color:var(--text-hint-color);font-style:italic}.gz-block-comments-list,.gz-block-comment-replies{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5rem}.gz-block-comment-replies{margin-top:.5rem;padding-left:.75rem;border-left:2px solid var(--border-basic-color-3)}.gz-block-comment{display:flex;flex-direction:column;gap:.125rem}.gz-block-comment.resolved{opacity:.65}.gz-block-comment-head{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap}.gz-block-comment-head .gz-block-comment-author{font-weight:600}.gz-block-comment-head .gz-block-comment-date{font-size:.6875rem;color:var(--text-hint-color)}.gz-block-comment-body{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.gz-block-comment-actions{display:flex;align-items:center;gap:.125rem}.gz-block-composer{position:relative;display:flex;flex-direction:column;gap:.375rem}.gz-block-composer textarea{resize:vertical}.gz-block-composer-actions{display:flex;align-items:center;gap:.375rem}.gz-block-hint{flex:1 1 auto;font-size:.6875rem;color:var(--text-hint-color)}.gz-block-mentions{position:absolute;z-index:10;top:100%;left:0;right:0;margin:.125rem 0 0;padding:.25rem;list-style:none;max-height:12rem;overflow-y:auto;border:1px solid var(--border-basic-color-3);border-radius:.375rem;background:var(--background-basic-color-1);box-shadow:0 .5rem 1rem #0000001f}.gz-block-mentions button{display:flex;align-items:center;gap:.375rem;width:100%;padding:.25rem .375rem;border:0;border-radius:.25rem;background:transparent;color:var(--text-basic-color);font:inherit;text-align:left;cursor:pointer}.gz-block-mentions button:hover,.gz-block-mentions button.active{background:var(--background-basic-color-2)}\n"] }]
        }], propDecorators: { documentId: [{
                type: Input
            }], documentName: [{
                type: Input
            }], blockId: [{
                type: Input
            }], knownBlockIds: [{
                type: Input
            }], openBlocksChanged: [{
                type: Output
            }], blockFocused: [{
                type: Output
            }], composerRef: [{
                type: ViewChild,
                args: ['composerInput']
            }] } });
//# sourceMappingURL=block-comment-thread.component.js.map