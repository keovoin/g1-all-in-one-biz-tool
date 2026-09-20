import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import type { Editor, JSONContent } from '@tiptap/core';
import { PresetToolbarOptions, RichTextEditorPreset, ToolbarGroup } from './presets/preset.types';
import * as i0 from "@angular/core";
/**
 * `ga-rich-text-editor` — the shared tier-1 rich-text form control
 * (05-editor-spec.md §3). Wraps a TipTap v3 `Editor` directly (no third-party
 * Angular binding) and implements the full `ControlValueAccessor` contract so it
 * drops into `formControlName` / `[formControl]` / `ngModel` exactly where the
 * legacy CKEditor sites were mounted.
 *
 * - `outputFormat: 'html'` (default) reads/writes HTML strings — legacy-field mode.
 * - `outputFormat: 'json'` reads/writes TipTap JSON documents.
 * - An empty document always maps to `''` so `Validators.required` keeps working.
 * - The editor is instantiated in the browser only; on the server the component
 *   renders a non-interactive sanitized preview of the written HTML value.
 * - The preset (and its extension chunk) is resolved through a dynamic import at
 *   instantiation, so each preset stays its own lazy chunk (§12).
 */
export declare class RichTextEditorComponent implements AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
    private readonly _zone;
    private readonly _cdr;
    private readonly _sanitizer;
    private readonly _platformId;
    /** Selects the extension set + toolbar layout. Not mutable after init. */
    preset: RichTextEditorPreset;
    /** Already-translated placeholder text (callers pass `'…' | translate`). */
    placeholder: string;
    /** `'html'`: CVA reads/writes HTML strings (legacy-field mode). `'json'`: TipTap JSON. */
    outputFormat: 'html' | 'json';
    /** CSS length applied to `.ProseMirror { min-height }`. */
    minHeight: string;
    /** When set, the content area scrolls. */
    maxHeight: string | null;
    /** CharacterCount hard limit. Applied at instantiation. */
    characterLimit: number | null;
    /** Renders the chars/words footer row. */
    showCharacterCount: boolean;
    /** Extra class on the `.ProseMirror` host for per-site tweaks. */
    editorClass: string;
    /** Mirrors `setDisabledState` — either path makes content non-editable + toolbar inert. */
    set disabled(value: boolean);
    get disabled(): boolean;
    /** After browser-side instantiation — escape hatch for programmatic control. */
    created: EventEmitter<Editor>;
    /** Every doc-changing transaction; payload shape follows `outputFormat`. */
    changed: EventEmitter<string | JSONContent>;
    /** Editor gained focus. */
    focused: EventEmitter<void>;
    /** Editor lost focus (also triggers the CVA `onTouched`). */
    blurred: EventEmitter<void>;
    contentRef: ElementRef<HTMLDivElement>;
    /** Last-resort escape hatch (also emitted by `created`). */
    editor: Editor | null;
    toolbarGroups: ToolbarGroup[];
    toolbarOptions: PresetToolbarOptions;
    isDisabled: boolean;
    isFocused: boolean;
    characters: number;
    words: number;
    ssrPreviewHtml: string | null;
    /** Value written before the editor exists (SSR / early `writeValue`) — applied at instantiation. */
    private _pendingValue;
    private _hasPendingValue;
    /** A queued `setContent(value, true)` still owes the form its notification. */
    private _pendingEmitUpdate;
    /** Guard against write→update→write feedback loops when the form patches back the emitted value. */
    private _lastEmittedValue;
    private _destroyed;
    private _onChange;
    private _onTouched;
    private _touched;
    constructor(_zone: NgZone, _cdr: ChangeDetectorRef, _sanitizer: DomSanitizer, _platformId: object);
    get showCounter(): boolean;
    get counterStatus(): 'basic' | 'warning' | 'danger';
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    writeValue(value: string | JSONContent | null | undefined): void;
    registerOnChange(fn: (value: string | JSONContent) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    /**
     * Replaces the whole content. The mandated replacement for the one legacy
     * imperative CKEditor call site: with `emitUpdate` left `true` the CVA emits
     * and the bound form control stays in sync.
     */
    setContent(value: string | JSONContent, emitUpdate?: boolean): void;
    /** Inserts content at the cursor. */
    insertContent(value: string | JSONContent): void;
    focus(position?: 'start' | 'end'): void;
    getHTML(): string;
    getJSON(): JSONContent | null;
    getText(): string;
    isEmpty(): boolean;
    private _createEditor;
    private _applyValue;
    /**
     * Serialize the editor's document into the value the CVA / `changed` output carries.
     *
     * Empty-document normalization: an empty doc emits '' — never '<p></p>' —
     * so `Validators.required` on existing forms keeps working unchanged.
     */
    private _serializeValue;
    private _handleUpdate;
    private _refreshCounts;
    private _applyPlaceholder;
    static ɵfac: i0.ɵɵFactoryDeclaration<RichTextEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RichTextEditorComponent, "ga-rich-text-editor", never, { "preset": { "alias": "preset"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "outputFormat": { "alias": "outputFormat"; "required": false; }; "minHeight": { "alias": "minHeight"; "required": false; }; "maxHeight": { "alias": "maxHeight"; "required": false; }; "characterLimit": { "alias": "characterLimit"; "required": false; }; "showCharacterCount": { "alias": "showCharacterCount"; "required": false; }; "editorClass": { "alias": "editorClass"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, { "created": "created"; "changed": "changed"; "focused": "focused"; "blurred": "blurred"; }, never, never, false, never>;
}
