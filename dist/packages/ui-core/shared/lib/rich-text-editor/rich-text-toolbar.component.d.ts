import { AfterViewChecked, ChangeDetectorRef, ElementRef, NgZone, OnDestroy } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { PresetToolbarOptions, ToolbarAlignment, ToolbarGroup, ToolbarMark } from './presets/preset.types';
import * as i0 from "@angular/core";
type BlockFormat = 'paragraph' | 'h1' | 'h2' | 'h3';
interface FontStack {
    label: string;
    value: string;
}
/**
 * `ga-rich-text-toolbar` — internal toolbar of `ga-rich-text-editor`
 * (05-editor-spec.md §3.4). Button clusters are driven by the preset's
 * `ToolbarGroup[]`; individual buttons additionally gate on schema membership so
 * a cluster never renders a command its editor cannot execute. Active state is
 * re-read on every editor transaction (re-entered into Angular's zone).
 *
 * Keyboard model (05-editor-spec.md §13 / §3.10): each `role="toolbar"` row is a single
 * composite widget — ONE tab stop, with ←/→/Home/End moving between its controls — so Tab
 * from the field before the editor lands on the toolbar once and Tab again enters
 * `.ProseMirror`, instead of walking ~25 separate stops.
 */
export declare class RichTextToolbarComponent implements AfterViewChecked, OnDestroy {
    private readonly _zone;
    private readonly _cdr;
    private readonly _host;
    set editor(value: Editor | null);
    get editor(): Editor | null;
    groups: ToolbarGroup[];
    options: PresetToolbarOptions;
    disabled: boolean;
    /** editor.isActive(...) snapshot, refreshed per transaction. */
    active: Record<string, boolean>;
    blockFormat: BlockFormat;
    currentFontFamily: string;
    canUndo: boolean;
    canRedo: boolean;
    /** Inline popovers (tier 1 keeps link/image/color as lightweight popovers — no NbDialog round-trip). */
    linkFormOpen: boolean;
    linkUrl: string;
    imageFormOpen: boolean;
    imageUrl: string;
    textColorOpen: boolean;
    highlightOpen: boolean;
    /** 12 text-color swatches from the Gauzy/Nebular palette. */
    readonly textColors: string[];
    /** 5 highlight swatches. */
    readonly highlightColors: string[];
    /** 6 font-stack presets (05-editor-spec.md §3.3). */
    readonly fontFamilies: FontStack[];
    /**
     * The controls that take part in a toolbar row's roving tabindex.
     *
     * 🛑 Matched with `>` on purpose: the link / image / colour popovers live INSIDE
     * `.rich-text-toolbar__group` but are separate widgets with their own inputs and buttons, and
     * a descendant selector would swallow them into the arrow-key ring. `nb-select` contributes
     * its internal trigger button, which is the element that actually takes focus.
     */
    private static readonly ROVING_ITEM_SELECTOR;
    private _editor;
    private readonly _transactionHandler;
    /**
     * Active item index per toolbar row. Keyed by the row element rather than held as a single
     * field because the contextual table-operations row is a second, independent `role="toolbar"`.
     * A `WeakMap` so the entry for that row disappears with it when the caret leaves the table.
     */
    private readonly _activeIndex;
    constructor(_zone: NgZone, _cdr: ChangeDetectorRef, _host: ElementRef<HTMLElement>);
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    /**
     * ←/→ wrap around the row, Home/End jump to its ends.
     *
     * Only keys pressed on a control that is part of the ring are handled — a keystroke inside a
     * popover input keeps its native behaviour, and Tab is never intercepted so it still exits the
     * toolbar into `.ProseMirror`.
     */
    onToolbarKeydown(event: KeyboardEvent): void;
    /**
     * Adopts whatever the user focused — by click or by tabbing in — as the row's tab stop, so the
     * next Tab-out / Tab-in round-trip returns to where they left off.
     */
    onToolbarFocusIn(event: FocusEvent): void;
    /** The `role="toolbar"` row owning `target`, or `null` when it is outside this component. */
    private _toolbarOf;
    /** The focusable controls of one toolbar row, in DOM order. */
    private _itemsOf;
    /**
     * Gives each toolbar row exactly one item with `tabindex="0"` and `-1` for the rest.
     *
     * Driven from the DOM after every check rather than bound per button because nearly every
     * button sits behind an `*ngIf` (preset cluster, schema membership, `canUndo`/`canRedo`): a
     * template-bound index would drift the moment a preset drops a cluster or a command becomes
     * unavailable. Writes are diffed, so a keystroke that only refreshes active state touches
     * nothing.
     */
    private _syncRovingTabIndex;
    /** Whether the preset renders a toolbar cluster. */
    inGroup(group: ToolbarGroup): boolean;
    /** Whether the preset offers a basic mark button. */
    hasMarkButton(mark: ToolbarMark): boolean;
    hasAlignment(alignment: ToolbarAlignment): boolean;
    /** Schema-membership gates: never render a command the schema cannot execute. */
    hasNode(name: string): boolean;
    hasMark(name: string): boolean;
    /**
     * Runs a chained editor command by name (`toggleBold`, `undo`, `addRowAfter`, …).
     * The cast is contained here: command names come from the fixed template, but the
     * chain type only knows commands of statically-registered extensions.
     */
    run(command: string, attributes?: Record<string, unknown>): void;
    setBlockFormat(format: BlockFormat): void;
    setAlignment(alignment: ToolbarAlignment): void;
    setFontFamily(fontFamily: string): void;
    setTextColor(color: string | null): void;
    setHighlight(color: string | null): void;
    clearFormatting(): void;
    insertTable(): void;
    toggleLinkForm(): void;
    applyLink(): void;
    removeLink(): void;
    toggleImageForm(): void;
    applyImage(): void;
    toggleTextColorPanel(): void;
    toggleHighlightPanel(): void;
    private _attachToEditor;
    private _detachFromEditor;
    private _updateState;
    /**
     * Value shown by the block-format dropdown: the first active heading level the toolbar
     * offers, falling back to `paragraph` when none of them is active.
     */
    private _resolveBlockFormat;
    static ɵfac: i0.ɵɵFactoryDeclaration<RichTextToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RichTextToolbarComponent, "ga-rich-text-toolbar", never, { "editor": { "alias": "editor"; "required": false; }; "groups": { "alias": "groups"; "required": false; }; "options": { "alias": "options"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, false, never>;
}
export {};
