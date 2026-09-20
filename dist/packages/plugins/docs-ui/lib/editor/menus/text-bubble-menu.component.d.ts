import { AfterViewInit, ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Editor } from '@tiptap/core';
import * as i0 from "@angular/core";
/** 12 text-color swatches + reset (spec 05 §5 TextStyleKit). */
export declare const TEXT_COLORS: string[];
/** 5 highlight swatches from the Gauzy palette (spec 05 §5 Highlight). */
export declare const HIGHLIGHT_COLORS: string[];
type TurnInto = 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'orderedList' | 'blockquote' | 'callout';
/**
 * Selection bubble menu (spec 05 §6.5): marks, link, highlight, text color and
 * a "turn into" dropdown. Suppressed inside code blocks, on node selections and
 * while a suggestion popup is open.
 */
export declare class TextBubbleMenuComponent implements AfterViewInit, OnChanges, OnDestroy {
    editor: Editor;
    /**
     * The user asked to comment on the current selection's block (spec 05 §8). The menu
     * only resolves the anchor — the thread itself lives in the page's Comments rail, which
     * owns the `/api/comment` calls.
     */
    commentRequested: EventEmitter<string>;
    menuRef: ElementRef<HTMLElement>;
    private readonly suggestionHost;
    private readonly cdr;
    private readonly zone;
    readonly textColors: string[];
    readonly highlightColors: string[];
    linkEditing: boolean;
    linkUrl: string;
    highlightOpen: boolean;
    colorOpen: boolean;
    turnIntoOpen: boolean;
    private readonly onTransaction;
    /**
     * The `Editor` this component's ProseMirror plugin and listeners are currently
     * registered against — deliberately *not* read back off `this.editor`, which the
     * parent re-points before the teardown of the previous registration can run.
     */
    private attached;
    ngAfterViewInit(): void;
    /**
     * `DocumentEditorComponent.rebuildEditor()` (route `page/:id` change) destroys the
     * old `Editor` and builds the replacement **synchronously**, so the `*ngIf="editor"`
     * wrapping this component never goes falsy and this view is never torn down and
     * recreated — only the `[editor]` binding changes. Without re-registering here the
     * menu stays bound to a destroyed editor and every button silently does nothing
     * after switching documents (spec 05 §9.2).
     */
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private attach;
    private detach;
    isActive(name: string): boolean;
    /**
     * False until UniqueID has stamped the enclosing block — a comment with no anchor could
     * never be shown next to anything, so the action is disabled rather than silently lost.
     */
    get canComment(): boolean;
    comment(): void;
    run(command: 'toggleBold' | 'toggleItalic' | 'toggleUnderline' | 'toggleStrike' | 'toggleCode'): void;
    startLinkEdit(): void;
    applyLink(): void;
    removeLink(): void;
    setHighlight(color: string | null): void;
    setColor(color: string | null): void;
    turnInto(target: TurnInto): void;
    private readonly closePanels;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextBubbleMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextBubbleMenuComponent, "gz-text-bubble-menu", never, { "editor": { "alias": "editor"; "required": true; }; }, { "commentRequested": "commentRequested"; }, never, never, true, never>;
}
export {};
