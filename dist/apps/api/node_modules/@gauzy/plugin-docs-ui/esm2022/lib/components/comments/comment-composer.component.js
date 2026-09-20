import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { applyMentionPick, collectMentionEmployeeIds, detectMentionToken } from './document-comments.model';
import { MentionDirectoryService } from './mention-directory.service';
import * as i0 from "@angular/core";
import * as i1 from "./mention-directory.service";
import * as i2 from "@angular/common";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
/**
 * Plain-text comment box with an `@` mention menu (spec 01 §8.10 / 08 §1).
 *
 * The same component is the new-comment box, the reply box and the inline
 * editor — only the labels and the seed text change. Text is deliberately plain:
 * `Comment.comment` is a `text` column that the notification e-mail renders
 * verbatim, so a rich-text body would arrive as markup in someone's inbox.
 *
 * 🛑 The `@` menu does not itself notify anyone. Picking an employee records the
 * label written into the text; on submit `collectMentionEmployeeIds()` reports
 * only the picks still present in the body, and the backend
 * (`CommentService.create` → `MentionService.publishMention`) does the fan-out
 * from that array. Dropping a name from the text therefore un-notifies them,
 * which is the behaviour people expect from a draft they edited.
 */
export class CommentComposerComponent {
    constructor(directory) {
        this.directory = directory;
        /** Seed text — set by the inline editor, empty for a new comment or reply. */
        this.value = '';
        /** Employees already mentioned in `value`, so an edit keeps notifying them. */
        this.picked = [];
        this.placeholderKey = 'DOCS.COMMENTS.PLACEHOLDER';
        this.submitLabelKey = 'DOCS.COMMENTS.POST';
        /** True while the parent's request is in flight — the box locks, it does not clear. */
        this.pending = false;
        this.cancellable = false;
        /** Reply/edit boxes sit inside a comment and get less vertical room. */
        this.compact = false;
        this.submitted = new EventEmitter();
        this.cancelled = new EventEmitter();
        this.text = '';
        this.suggestions = [];
        this.activeIndex = 0;
        this.mentionsOpen = false;
        /** Every employee picked from the menu in this composer, plus the seeded ones. */
        this.mentioned = [];
        this.token = null;
        /** Guards against a slow directory response painting a menu for a token already gone. */
        this.sequence = 0;
    }
    ngOnChanges(changes) {
        if (changes['value'])
            this.text = this.value ?? '';
        if (changes['picked'])
            this.mentioned = [...(this.picked ?? [])];
    }
    get canSubmit() {
        return !this.pending && this.text.trim().length > 0;
    }
    // ─── Typing ──────────────────────────────────────────────────
    async onInput(event) {
        const target = event.target;
        this.text = target.value;
        this.token = detectMentionToken(this.text, target.selectionStart ?? this.text.length);
        if (!this.token) {
            this.closeMentions();
            return;
        }
        await this.loadSuggestions(this.token.query);
    }
    /**
     * Arrow keys / Enter / Escape belong to the menu while it is open; Enter alone
     * would otherwise post a comment the author was still naming someone in.
     */
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
        // Enter posts only with a modifier — a plain Enter is a new paragraph.
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            this.submit();
        }
    }
    // ─── Mentions ────────────────────────────────────────────────
    pick(candidate, event) {
        // `mousedown`, not `click`: the textarea's blur would close the menu first.
        event?.preventDefault();
        if (!candidate || !this.token)
            return;
        const caret = this.inputRef?.nativeElement.selectionStart ?? this.text.length;
        const applied = applyMentionPick(this.text, this.token, caret, candidate.label);
        this.text = applied.text;
        if (!this.mentioned.some((entry) => String(entry.id) === String(candidate.id))) {
            this.mentioned = [...this.mentioned, candidate];
        }
        this.closeMentions();
        this.focusAt(applied.caret);
    }
    closeMentions() {
        this.mentionsOpen = false;
        this.suggestions = [];
        this.activeIndex = 0;
        this.token = null;
    }
    async loadSuggestions(query) {
        const mySequence = ++this.sequence;
        const candidates = await firstValueFrom(this.directory.search(query));
        if (mySequence !== this.sequence || !this.token)
            return;
        this.suggestions = candidates;
        this.activeIndex = 0;
        this.mentionsOpen = candidates.length > 0;
    }
    // ─── Submit ──────────────────────────────────────────────────
    submit() {
        if (!this.canSubmit)
            return;
        const comment = this.text.trim();
        this.submitted.emit({
            comment,
            mentionEmployeeIds: collectMentionEmployeeIds(comment, this.mentioned)
        });
    }
    /** Clears the box after the parent confirms the post landed. */
    reset() {
        this.text = '';
        this.mentioned = [];
        this.closeMentions();
    }
    focusAt(caret) {
        const element = this.inputRef?.nativeElement;
        if (!element)
            return;
        element.value = this.text;
        element.focus();
        element.setSelectionRange(caret, caret);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommentComposerComponent, deps: [{ token: i1.MentionDirectoryService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: CommentComposerComponent, isStandalone: false, selector: "gz-docs-comment-composer", inputs: { value: "value", picked: "picked", placeholderKey: "placeholderKey", submitLabelKey: "submitLabelKey", pending: "pending", cancellable: "cancellable", compact: "compact" }, outputs: { submitted: "submitted", cancelled: "cancelled" }, viewQueries: [{ propertyName: "inputRef", first: true, predicate: ["input"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
		<div class="gz-comment-composer" [class.compact]="compact">
			<textarea
				#input
				nbInput
				fullWidth
				fieldSize="small"
				[rows]="compact ? 2 : 3"
				[value]="text"
				[disabled]="pending"
				[placeholder]="placeholderKey | translate"
				[attr.aria-label]="placeholderKey | translate"
				(input)="onInput($event)"
				(keydown)="onKeyDown($event)"
				(blur)="closeMentions()"
			></textarea>

			<ul
				class="gz-comment-mentions"
				*ngIf="mentionsOpen && suggestions.length"
				role="listbox"
				[attr.aria-label]="'DOCS.COMMENTS.MENTION_ARIA' | translate"
			>
				<li *ngFor="let candidate of suggestions; let index = index">
					<button
						type="button"
						role="option"
						[attr.aria-selected]="index === activeIndex"
						[class.active]="index === activeIndex"
						(mousedown)="pick(candidate, $event)"
					>
						<nb-icon icon="person-outline"></nb-icon>
						<span>{{ candidate.label }}</span>
					</button>
				</li>
			</ul>

			<div class="gz-comment-composer-actions">
				<span class="gz-comment-hint">{{ 'DOCS.COMMENTS.MENTION_HINT' | translate }}</span>
				<button *ngIf="cancellable" nbButton ghost size="tiny" type="button" (click)="cancelled.emit()">
					{{ 'DOCS.COMMENTS.CANCEL' | translate }}
				</button>
				<button
					nbButton
					status="primary"
					size="tiny"
					type="button"
					[disabled]="!canSubmit"
					(click)="submit()"
				>
					{{ submitLabelKey | translate }}
				</button>
			</div>
		</div>
	`, isInline: true, styles: [".gz-comment-composer{position:relative;display:flex;flex-direction:column;gap:.375rem}.gz-comment-composer textarea{resize:vertical}.gz-comment-composer-actions{display:flex;align-items:center;gap:.375rem}.gz-comment-hint{flex:1 1 auto;font-size:.6875rem;color:var(--text-hint-color)}.gz-comment-mentions{position:absolute;z-index:10;top:100%;left:0;right:0;margin:.125rem 0 0;padding:.25rem;list-style:none;max-height:12rem;overflow-y:auto;border:1px solid var(--border-basic-color-3);border-radius:.375rem;background:var(--background-basic-color-1);box-shadow:0 .5rem 1rem #0000001f}.gz-comment-mentions button{display:flex;align-items:center;gap:.375rem;width:100%;padding:.25rem .375rem;border:0;border-radius:.25rem;background:transparent;color:var(--text-basic-color);font:inherit;text-align:left;cursor:pointer}.gz-comment-mentions button:hover,.gz-comment-mentions button.active{background:var(--background-basic-color-2)}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CommentComposerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-comment-composer', template: `
		<div class="gz-comment-composer" [class.compact]="compact">
			<textarea
				#input
				nbInput
				fullWidth
				fieldSize="small"
				[rows]="compact ? 2 : 3"
				[value]="text"
				[disabled]="pending"
				[placeholder]="placeholderKey | translate"
				[attr.aria-label]="placeholderKey | translate"
				(input)="onInput($event)"
				(keydown)="onKeyDown($event)"
				(blur)="closeMentions()"
			></textarea>

			<ul
				class="gz-comment-mentions"
				*ngIf="mentionsOpen && suggestions.length"
				role="listbox"
				[attr.aria-label]="'DOCS.COMMENTS.MENTION_ARIA' | translate"
			>
				<li *ngFor="let candidate of suggestions; let index = index">
					<button
						type="button"
						role="option"
						[attr.aria-selected]="index === activeIndex"
						[class.active]="index === activeIndex"
						(mousedown)="pick(candidate, $event)"
					>
						<nb-icon icon="person-outline"></nb-icon>
						<span>{{ candidate.label }}</span>
					</button>
				</li>
			</ul>

			<div class="gz-comment-composer-actions">
				<span class="gz-comment-hint">{{ 'DOCS.COMMENTS.MENTION_HINT' | translate }}</span>
				<button *ngIf="cancellable" nbButton ghost size="tiny" type="button" (click)="cancelled.emit()">
					{{ 'DOCS.COMMENTS.CANCEL' | translate }}
				</button>
				<button
					nbButton
					status="primary"
					size="tiny"
					type="button"
					[disabled]="!canSubmit"
					(click)="submit()"
				>
					{{ submitLabelKey | translate }}
				</button>
			</div>
		</div>
	`, standalone: false, styles: [".gz-comment-composer{position:relative;display:flex;flex-direction:column;gap:.375rem}.gz-comment-composer textarea{resize:vertical}.gz-comment-composer-actions{display:flex;align-items:center;gap:.375rem}.gz-comment-hint{flex:1 1 auto;font-size:.6875rem;color:var(--text-hint-color)}.gz-comment-mentions{position:absolute;z-index:10;top:100%;left:0;right:0;margin:.125rem 0 0;padding:.25rem;list-style:none;max-height:12rem;overflow-y:auto;border:1px solid var(--border-basic-color-3);border-radius:.375rem;background:var(--background-basic-color-1);box-shadow:0 .5rem 1rem #0000001f}.gz-comment-mentions button{display:flex;align-items:center;gap:.375rem;width:100%;padding:.25rem .375rem;border:0;border-radius:.25rem;background:transparent;color:var(--text-basic-color);font:inherit;text-align:left;cursor:pointer}.gz-comment-mentions button:hover,.gz-comment-mentions button.active{background:var(--background-basic-color-2)}\n"] }]
        }], ctorParameters: () => [{ type: i1.MentionDirectoryService }], propDecorators: { value: [{
                type: Input
            }], picked: [{
                type: Input
            }], placeholderKey: [{
                type: Input
            }], submitLabelKey: [{
                type: Input
            }], pending: [{
                type: Input
            }], cancellable: [{
                type: Input
            }], compact: [{
                type: Input
            }], submitted: [{
                type: Output
            }], cancelled: [{
                type: Output
            }], inputRef: [{
                type: ViewChild,
                args: ['input']
            }] } });
//# sourceMappingURL=comment-composer.component.js.map