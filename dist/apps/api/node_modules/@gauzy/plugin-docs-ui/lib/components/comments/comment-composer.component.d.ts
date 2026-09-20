import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ID } from '@gauzy/contracts';
import { IMentionCandidate } from './document-comments.model';
import { MentionDirectoryService } from './mention-directory.service';
import * as i0 from "@angular/core";
/** What a composer hands back — the text plus the ids the backend fans notifications out to. */
export interface ICommentDraft {
    comment: string;
    mentionEmployeeIds: ID[];
}
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
export declare class CommentComposerComponent implements OnChanges {
    private readonly directory;
    /** Seed text — set by the inline editor, empty for a new comment or reply. */
    value: string;
    /** Employees already mentioned in `value`, so an edit keeps notifying them. */
    picked: IMentionCandidate[];
    placeholderKey: string;
    submitLabelKey: string;
    /** True while the parent's request is in flight — the box locks, it does not clear. */
    pending: boolean;
    cancellable: boolean;
    /** Reply/edit boxes sit inside a comment and get less vertical room. */
    compact: boolean;
    submitted: EventEmitter<ICommentDraft>;
    cancelled: EventEmitter<void>;
    private inputRef?;
    text: string;
    suggestions: IMentionCandidate[];
    activeIndex: number;
    mentionsOpen: boolean;
    /** Every employee picked from the menu in this composer, plus the seeded ones. */
    private mentioned;
    private token;
    /** Guards against a slow directory response painting a menu for a token already gone. */
    private sequence;
    constructor(directory: MentionDirectoryService);
    ngOnChanges(changes: SimpleChanges): void;
    get canSubmit(): boolean;
    onInput(event: Event): Promise<void>;
    /**
     * Arrow keys / Enter / Escape belong to the menu while it is open; Enter alone
     * would otherwise post a comment the author was still naming someone in.
     */
    onKeyDown(event: KeyboardEvent): void;
    pick(candidate?: IMentionCandidate, event?: Event): void;
    closeMentions(): void;
    private loadSuggestions;
    submit(): void;
    /** Clears the box after the parent confirms the post landed. */
    reset(): void;
    private focusAt;
    static ɵfac: i0.ɵɵFactoryDeclaration<CommentComposerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CommentComposerComponent, "gz-docs-comment-composer", never, { "value": { "alias": "value"; "required": false; }; "picked": { "alias": "picked"; "required": false; }; "placeholderKey": { "alias": "placeholderKey"; "required": false; }; "submitLabelKey": { "alias": "submitLabelKey"; "required": false; }; "pending": { "alias": "pending"; "required": false; }; "cancellable": { "alias": "cancellable"; "required": false; }; "compact": { "alias": "compact"; "required": false; }; }, { "submitted": "submitted"; "cancelled": "cancelled"; }, never, never, false, never>;
}
