import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, NgZone, Output, PLATFORM_ID, SecurityContext, ViewChild, forwardRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { normalizeLegacyHtml } from './legacy-html.util';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "@angular/common";
import * as i3 from "./rich-text-toolbar.component";
import * as i4 from "@ngx-translate/core";
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
export class RichTextEditorComponent {
    /** Mirrors `setDisabledState` — either path makes content non-editable + toolbar inert. */
    set disabled(value) {
        this.setDisabledState(!!value);
    }
    get disabled() {
        return this.isDisabled;
    }
    constructor(_zone, _cdr, _sanitizer, _platformId) {
        this._zone = _zone;
        this._cdr = _cdr;
        this._sanitizer = _sanitizer;
        this._platformId = _platformId;
        /** Selects the extension set + toolbar layout. Not mutable after init. */
        this.preset = 'standard';
        /** Already-translated placeholder text (callers pass `'…' | translate`). */
        this.placeholder = '';
        /** `'html'`: CVA reads/writes HTML strings (legacy-field mode). `'json'`: TipTap JSON. */
        this.outputFormat = 'html';
        /** CSS length applied to `.ProseMirror { min-height }`. */
        this.minHeight = '320px';
        /** When set, the content area scrolls. */
        this.maxHeight = null;
        /** CharacterCount hard limit. Applied at instantiation. */
        this.characterLimit = null;
        /** Renders the chars/words footer row. */
        this.showCharacterCount = false;
        /** Extra class on the `.ProseMirror` host for per-site tweaks. */
        this.editorClass = '';
        /** After browser-side instantiation — escape hatch for programmatic control. */
        this.created = new EventEmitter();
        /** Every doc-changing transaction; payload shape follows `outputFormat`. */
        this.changed = new EventEmitter();
        /** Editor gained focus. */
        this.focused = new EventEmitter();
        /** Editor lost focus (also triggers the CVA `onTouched`). */
        this.blurred = new EventEmitter();
        /** Last-resort escape hatch (also emitted by `created`). */
        this.editor = null;
        this.toolbarGroups = [];
        this.toolbarOptions = { marks: [], alignments: [] };
        this.isDisabled = false;
        this.isFocused = false;
        this.characters = 0;
        this.words = 0;
        this.ssrPreviewHtml = null;
        this._hasPendingValue = false;
        /** A queued `setContent(value, true)` still owes the form its notification. */
        this._pendingEmitUpdate = false;
        /** Guard against write→update→write feedback loops when the form patches back the emitted value. */
        this._lastEmittedValue = null;
        this._destroyed = false;
        this._onChange = () => { };
        this._onTouched = () => { };
        this._touched = false;
    }
    get showCounter() {
        return this.showCharacterCount || this.characterLimit != null;
    }
    get counterStatus() {
        if (this.characterLimit == null) {
            return 'basic';
        }
        if (this.characters >= this.characterLimit) {
            return 'danger';
        }
        return this.characters >= this.characterLimit * 0.9 ? 'warning' : 'basic';
    }
    ngAfterViewInit() {
        // `new Editor(...)` requires a real DOM — instantiate only in the browser (§3.8).
        if (!isPlatformBrowser(this._platformId)) {
            return;
        }
        // Fire-and-forget by necessity (a lifecycle hook cannot be awaited), so the promise
        // has to be terminated here: `_createEditor` opens with dynamic `import()`s, which
        // reject on a chunk-load failure — routine when a deploy invalidates hashed chunk
        // names while a tab is open. Left floating that surfaced only as an unhandled
        // rejection and a permanently blank editor.
        void this._createEditor().catch((error) => {
            console.error('[RichTextEditor] Failed to initialize the editor', error);
            // Keep the SSR/preview markup (or the empty box) rather than a half-built view,
            // and let the host re-render.
            this._cdr.markForCheck();
        });
    }
    ngOnChanges(changes) {
        if (changes['placeholder'] && !changes['placeholder'].firstChange) {
            this._applyPlaceholder(this.placeholder ?? '');
        }
    }
    ngOnDestroy() {
        // Unconditional destroy — leaked ProseMirror views hold DOM references (§3.8).
        this._destroyed = true;
        this.editor?.destroy();
        this.editor = null;
    }
    // -------------------------------------------------------------------------
    // ControlValueAccessor
    // -------------------------------------------------------------------------
    writeValue(value) {
        if (!this.editor) {
            this._pendingValue = value;
            this._hasPendingValue = true;
            // A form write is the source of truth already — applying it must not echo back.
            this._pendingEmitUpdate = false;
            if (!isPlatformBrowser(this._platformId) &&
                this.outputFormat === 'html' &&
                typeof value === 'string' &&
                value) {
                // SSR: non-interactive preview through Angular's sanitizer.
                this.ssrPreviewHtml = this._sanitizer.sanitize(SecurityContext.HTML, value);
            }
            return;
        }
        this._applyValue(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled = isDisabled;
        this.editor?.setEditable(!isDisabled);
        this._cdr.markForCheck();
    }
    // -------------------------------------------------------------------------
    // Public programmatic API (05-editor-spec.md §3.7)
    // -------------------------------------------------------------------------
    /**
     * Replaces the whole content. The mandated replacement for the one legacy
     * imperative CKEditor call site: with `emitUpdate` left `true` the CVA emits
     * and the bound form control stays in sync.
     */
    setContent(value, emitUpdate = true) {
        if (!this.editor) {
            // Called before instantiation (a seed from `ngOnInit`, or SSR): queue the
            // value *and* the caller's intent to emit — dropping the emit silently
            // applied the content while the bound control kept its old value.
            this._pendingValue = value;
            this._hasPendingValue = true;
            this._pendingEmitUpdate = emitUpdate;
            return;
        }
        const content = typeof value === 'string' ? normalizeLegacyHtml(value) : value;
        this.editor.commands.setContent(content, { emitUpdate });
    }
    /** Inserts content at the cursor. */
    insertContent(value) {
        this.editor?.chain().focus().insertContent(value).run();
    }
    focus(position = 'end') {
        this.editor?.chain().focus(position).run();
    }
    getHTML() {
        return this.editor && !this.editor.isEmpty ? this.editor.getHTML() : '';
    }
    getJSON() {
        return this.editor ? this.editor.getJSON() : null;
    }
    getText() {
        return this.editor ? this.editor.getText() : '';
    }
    isEmpty() {
        return this.editor ? this.editor.isEmpty : true;
    }
    // -------------------------------------------------------------------------
    // Internals
    // -------------------------------------------------------------------------
    async _createEditor() {
        // Each preset is its own lazy chunk (§12); the Editor class rides along with it.
        const [{ Editor: TiptapEditor }, { createEditorExtensions }] = await Promise.all([
            import('@tiptap/core'),
            import('./presets')
        ]);
        const options = {
            placeholder: this.placeholder ?? '',
            characterLimit: this.characterLimit
        };
        const definition = await createEditorExtensions(this.preset, options);
        if (this._destroyed) {
            return;
        }
        this.toolbarGroups = definition.toolbar;
        this.toolbarOptions = definition.toolbarOptions;
        // TipTap events fire outside Angular's zone; re-enter only to push state (§3.8).
        this._zone.runOutsideAngular(() => {
            this.editor = new TiptapEditor({
                element: this.contentRef.nativeElement,
                extensions: definition.extensions,
                editable: !this.isDisabled,
                editorProps: {
                    attributes: {
                        class: `rich-text-editor__prosemirror ${this.editorClass}`.trim(),
                        role: 'textbox',
                        'aria-multiline': 'true'
                    }
                },
                onUpdate: ({ editor, transaction }) => {
                    if (!transaction.docChanged) {
                        return;
                    }
                    this._zone.run(() => this._handleUpdate(editor));
                },
                onFocus: () => {
                    this._zone.run(() => {
                        this.isFocused = true;
                        this.focused.emit();
                        this._cdr.markForCheck();
                    });
                },
                onBlur: () => {
                    this._zone.run(() => {
                        this.isFocused = false;
                        if (!this._touched) {
                            this._touched = true;
                        }
                        this._onTouched();
                        this.blurred.emit();
                        this._cdr.markForCheck();
                    });
                }
            });
        });
        if (this._hasPendingValue) {
            const emitUpdate = this._pendingEmitUpdate;
            this._applyValue(this._pendingValue);
            this._pendingValue = undefined;
            this._hasPendingValue = false;
            this._pendingEmitUpdate = false;
            // Honour the queued `setContent(value, true)`: the content was applied
            // with `emitUpdate: false`, so the CVA notification has to be issued here.
            if (emitUpdate && this.editor) {
                this._handleUpdate(this.editor);
            }
        }
        this._refreshCounts();
        this.ssrPreviewHtml = null;
        this.created.emit(this.editor);
        this._cdr.markForCheck();
    }
    _applyValue(value) {
        if (!this.editor) {
            return;
        }
        // Equality guard: skip the value the editor itself just emitted.
        if (value === this._lastEmittedValue && value !== null && value !== undefined) {
            return;
        }
        if (value === null || value === undefined || value === '') {
            this.editor.commands.clearContent(false);
        }
        else if (typeof value === 'string') {
            this.editor.commands.setContent(normalizeLegacyHtml(value), { emitUpdate: false });
        }
        else {
            this.editor.commands.setContent(value, { emitUpdate: false });
        }
        this._refreshCounts();
        this._cdr.markForCheck();
    }
    /**
     * Serialize the editor's document into the value the CVA / `changed` output carries.
     *
     * Empty-document normalization: an empty doc emits '' — never '<p></p>' —
     * so `Validators.required` on existing forms keeps working unchanged.
     */
    _serializeValue(editor) {
        if (editor.isEmpty) {
            return '';
        }
        return this.outputFormat === 'json' ? editor.getJSON() : editor.getHTML();
    }
    _handleUpdate(editor) {
        const value = this._serializeValue(editor);
        this._lastEmittedValue = value;
        this._onChange(value);
        this.changed.emit(value);
        this._refreshCounts();
        this._cdr.markForCheck();
    }
    _refreshCounts() {
        const storage = this.editor?.storage?.['characterCount'];
        if (storage) {
            this.characters = storage.characters();
            this.words = storage.words();
        }
    }
    _applyPlaceholder(text) {
        if (!this.editor) {
            return;
        }
        const extension = this.editor.extensionManager.extensions.find((ext) => ext.name === 'placeholder');
        if (extension) {
            // `options` is a read-only property on the extension, but the object it holds is the live
            // one the Placeholder plugin reads on every decoration pass — mutate it in place.
            Object.assign(extension.options, { placeholder: text });
            // Nudge a decoration re-render without touching the doc.
            this.editor.view.dispatch(this.editor.state.tr);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RichTextEditorComponent, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.DomSanitizer }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: RichTextEditorComponent, isStandalone: false, selector: "ga-rich-text-editor", inputs: { preset: "preset", placeholder: "placeholder", outputFormat: "outputFormat", minHeight: "minHeight", maxHeight: "maxHeight", characterLimit: "characterLimit", showCharacterCount: "showCharacterCount", editorClass: "editorClass", disabled: "disabled" }, outputs: { created: "created", changed: "changed", focused: "focused", blurred: "blurred" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => RichTextEditorComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "contentRef", first: true, predicate: ["content"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<div\n\tclass=\"rich-text-editor\"\n\t[class.rich-text-editor--disabled]=\"isDisabled\"\n\t[class.rich-text-editor--focused]=\"isFocused\"\n>\n\t<ga-rich-text-toolbar\n\t\t*ngIf=\"editor\"\n\t\t[editor]=\"editor\"\n\t\t[groups]=\"toolbarGroups\"\n\t\t[options]=\"toolbarOptions\"\n\t\t[disabled]=\"isDisabled\"\n\t></ga-rich-text-toolbar>\n\t<div\n\t\t#content\n\t\tclass=\"rich-text-editor__content\"\n\t\t[class.rich-text-editor__content--scroll]=\"!!maxHeight\"\n\t\t[style.--rte-min-height]=\"minHeight\"\n\t\t[style.--rte-max-height]=\"maxHeight\"\n\t></div>\n\t<!-- SSR / pre-instantiation preview: non-interactive, sanitized -->\n\t<div *ngIf=\"!editor && ssrPreviewHtml\" class=\"rich-text-editor__ssr-preview\" [innerHTML]=\"ssrPreviewHtml\"></div>\n\t<div *ngIf=\"showCounter\" class=\"rich-text-editor__footer\">\n\t\t<span\n\t\t\tclass=\"rich-text-editor__counter\"\n\t\t\t[class.rich-text-editor__counter--warning]=\"counterStatus === 'warning'\"\n\t\t\t[class.rich-text-editor__counter--danger]=\"counterStatus === 'danger'\"\n\t\t>\n\t\t\t{{ 'RICH_TEXT_EDITOR.CHARACTERS' | translate : { count: characters } }}\n\t\t</span>\n\t\t<span class=\"rich-text-editor__counter\">\n\t\t\t{{ 'RICH_TEXT_EDITOR.WORDS' | translate : { count: words } }}\n\t\t</span>\n\t</div>\n</div>\n", styles: [":host{display:block;width:100%}.rich-text-editor{display:flex;flex-direction:column;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1);transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}.rich-text-editor--focused{border-color:var(--color-primary-default);box-shadow:0 0 0 1px var(--color-primary-default)}.rich-text-editor--disabled{background:var(--background-basic-color-2);opacity:.75}.rich-text-editor__content{flex:1 1 auto}.rich-text-editor__content--scroll{max-height:var(--rte-max-height);overflow-y:auto}.rich-text-editor__ssr-preview{padding:.75rem 1rem;min-height:var(--rte-min-height, 320px);color:var(--text-basic-color)}.rich-text-editor__footer{display:flex;justify-content:flex-end;gap:.75rem;padding:.25rem 1rem;border-top:1px solid var(--border-basic-color-3)}.rich-text-editor__counter{font-size:.75rem;color:var(--text-hint-color)}.rich-text-editor__counter--warning{color:var(--color-warning-default)}.rich-text-editor__counter--danger{color:var(--color-danger-default)}:host ::ng-deep .ProseMirror{min-height:var(--rte-min-height, 320px);padding:.75rem 1rem;color:var(--text-basic-color);caret-color:var(--color-primary-default);outline:none}:host ::ng-deep .ProseMirror p.is-editor-empty:first-child:before,:host ::ng-deep .ProseMirror p.is-empty:first-child:before{content:attr(data-placeholder);color:var(--text-hint-color);float:left;height:0;pointer-events:none}:host ::ng-deep .ProseMirror a{color:var(--color-primary-default)}:host ::ng-deep .ProseMirror blockquote{margin:.5rem 0;padding-left:1rem;border-left:3px solid var(--color-primary-transparent-500);color:var(--text-hint-color)}:host ::ng-deep .ProseMirror code{padding:.125rem .375rem;border-radius:var(--border-radius);background:var(--background-basic-color-3);font-family:var(--font-family-monospace, monospace);font-size:.875em}:host ::ng-deep .ProseMirror pre{margin:.5rem 0;padding:.75rem 1rem;border-radius:var(--border-radius);background:var(--background-basic-color-2);font-family:var(--font-family-monospace, monospace);overflow-x:auto}:host ::ng-deep .ProseMirror pre code{padding:0;background:none}:host ::ng-deep .ProseMirror hr{margin:1rem 0;border:none;border-top:1px solid var(--border-basic-color-3)}:host ::ng-deep .ProseMirror mark{background:var(--color-warning-transparent-300);border-radius:.125rem}:host ::ng-deep .ProseMirror img{max-width:100%;height:auto}:host ::ng-deep .ProseMirror img.ProseMirror-selectednode{outline:2px solid var(--color-primary-default)}:host ::ng-deep .ProseMirror table{table-layout:fixed;width:100%;margin:.5rem 0;border-collapse:collapse;overflow:hidden}:host ::ng-deep .ProseMirror table th,:host ::ng-deep .ProseMirror table td{position:relative;min-width:2rem;padding:.375rem .5rem;border:1px solid var(--border-basic-color-3);vertical-align:top}:host ::ng-deep .ProseMirror table th>*,:host ::ng-deep .ProseMirror table td>*{margin-bottom:0}:host ::ng-deep .ProseMirror table th{background:var(--background-basic-color-2);font-weight:600;text-align:left}:host ::ng-deep .ProseMirror table .selectedCell:after{content:\"\";position:absolute;inset:0;z-index:2;background:var(--color-primary-transparent-200);pointer-events:none}:host ::ng-deep .ProseMirror table .column-resize-handle{position:absolute;top:0;bottom:-2px;right:-2px;width:4px;z-index:20;background-color:var(--color-primary-default);pointer-events:none}:host ::ng-deep .ProseMirror.resize-cursor{cursor:col-resize}:host ::ng-deep .ProseMirror ul[data-type=taskList]{list-style:none;margin-left:0;padding-left:0}:host ::ng-deep .ProseMirror ul[data-type=taskList] li{display:flex;align-items:flex-start;gap:.5rem}:host ::ng-deep .ProseMirror ul[data-type=taskList] li>label{flex:0 0 auto;margin-top:.25rem;-webkit-user-select:none;user-select:none}:host ::ng-deep .ProseMirror ul[data-type=taskList] li>label input[type=checkbox]{accent-color:var(--color-primary-default);cursor:pointer}:host ::ng-deep .ProseMirror ul[data-type=taskList] li>div{flex:1 1 auto}:host ::ng-deep .ProseMirror ul[data-type=taskList] li[data-checked=true]>div{color:var(--text-hint-color);text-decoration:line-through}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.RichTextToolbarComponent, selector: "ga-rich-text-toolbar", inputs: ["editor", "groups", "options", "disabled"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RichTextEditorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-rich-text-editor', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => RichTextEditorComponent),
                            multi: true
                        }
                    ], template: "<div\n\tclass=\"rich-text-editor\"\n\t[class.rich-text-editor--disabled]=\"isDisabled\"\n\t[class.rich-text-editor--focused]=\"isFocused\"\n>\n\t<ga-rich-text-toolbar\n\t\t*ngIf=\"editor\"\n\t\t[editor]=\"editor\"\n\t\t[groups]=\"toolbarGroups\"\n\t\t[options]=\"toolbarOptions\"\n\t\t[disabled]=\"isDisabled\"\n\t></ga-rich-text-toolbar>\n\t<div\n\t\t#content\n\t\tclass=\"rich-text-editor__content\"\n\t\t[class.rich-text-editor__content--scroll]=\"!!maxHeight\"\n\t\t[style.--rte-min-height]=\"minHeight\"\n\t\t[style.--rte-max-height]=\"maxHeight\"\n\t></div>\n\t<!-- SSR / pre-instantiation preview: non-interactive, sanitized -->\n\t<div *ngIf=\"!editor && ssrPreviewHtml\" class=\"rich-text-editor__ssr-preview\" [innerHTML]=\"ssrPreviewHtml\"></div>\n\t<div *ngIf=\"showCounter\" class=\"rich-text-editor__footer\">\n\t\t<span\n\t\t\tclass=\"rich-text-editor__counter\"\n\t\t\t[class.rich-text-editor__counter--warning]=\"counterStatus === 'warning'\"\n\t\t\t[class.rich-text-editor__counter--danger]=\"counterStatus === 'danger'\"\n\t\t>\n\t\t\t{{ 'RICH_TEXT_EDITOR.CHARACTERS' | translate : { count: characters } }}\n\t\t</span>\n\t\t<span class=\"rich-text-editor__counter\">\n\t\t\t{{ 'RICH_TEXT_EDITOR.WORDS' | translate : { count: words } }}\n\t\t</span>\n\t</div>\n</div>\n", styles: [":host{display:block;width:100%}.rich-text-editor{display:flex;flex-direction:column;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1);transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}.rich-text-editor--focused{border-color:var(--color-primary-default);box-shadow:0 0 0 1px var(--color-primary-default)}.rich-text-editor--disabled{background:var(--background-basic-color-2);opacity:.75}.rich-text-editor__content{flex:1 1 auto}.rich-text-editor__content--scroll{max-height:var(--rte-max-height);overflow-y:auto}.rich-text-editor__ssr-preview{padding:.75rem 1rem;min-height:var(--rte-min-height, 320px);color:var(--text-basic-color)}.rich-text-editor__footer{display:flex;justify-content:flex-end;gap:.75rem;padding:.25rem 1rem;border-top:1px solid var(--border-basic-color-3)}.rich-text-editor__counter{font-size:.75rem;color:var(--text-hint-color)}.rich-text-editor__counter--warning{color:var(--color-warning-default)}.rich-text-editor__counter--danger{color:var(--color-danger-default)}:host ::ng-deep .ProseMirror{min-height:var(--rte-min-height, 320px);padding:.75rem 1rem;color:var(--text-basic-color);caret-color:var(--color-primary-default);outline:none}:host ::ng-deep .ProseMirror p.is-editor-empty:first-child:before,:host ::ng-deep .ProseMirror p.is-empty:first-child:before{content:attr(data-placeholder);color:var(--text-hint-color);float:left;height:0;pointer-events:none}:host ::ng-deep .ProseMirror a{color:var(--color-primary-default)}:host ::ng-deep .ProseMirror blockquote{margin:.5rem 0;padding-left:1rem;border-left:3px solid var(--color-primary-transparent-500);color:var(--text-hint-color)}:host ::ng-deep .ProseMirror code{padding:.125rem .375rem;border-radius:var(--border-radius);background:var(--background-basic-color-3);font-family:var(--font-family-monospace, monospace);font-size:.875em}:host ::ng-deep .ProseMirror pre{margin:.5rem 0;padding:.75rem 1rem;border-radius:var(--border-radius);background:var(--background-basic-color-2);font-family:var(--font-family-monospace, monospace);overflow-x:auto}:host ::ng-deep .ProseMirror pre code{padding:0;background:none}:host ::ng-deep .ProseMirror hr{margin:1rem 0;border:none;border-top:1px solid var(--border-basic-color-3)}:host ::ng-deep .ProseMirror mark{background:var(--color-warning-transparent-300);border-radius:.125rem}:host ::ng-deep .ProseMirror img{max-width:100%;height:auto}:host ::ng-deep .ProseMirror img.ProseMirror-selectednode{outline:2px solid var(--color-primary-default)}:host ::ng-deep .ProseMirror table{table-layout:fixed;width:100%;margin:.5rem 0;border-collapse:collapse;overflow:hidden}:host ::ng-deep .ProseMirror table th,:host ::ng-deep .ProseMirror table td{position:relative;min-width:2rem;padding:.375rem .5rem;border:1px solid var(--border-basic-color-3);vertical-align:top}:host ::ng-deep .ProseMirror table th>*,:host ::ng-deep .ProseMirror table td>*{margin-bottom:0}:host ::ng-deep .ProseMirror table th{background:var(--background-basic-color-2);font-weight:600;text-align:left}:host ::ng-deep .ProseMirror table .selectedCell:after{content:\"\";position:absolute;inset:0;z-index:2;background:var(--color-primary-transparent-200);pointer-events:none}:host ::ng-deep .ProseMirror table .column-resize-handle{position:absolute;top:0;bottom:-2px;right:-2px;width:4px;z-index:20;background-color:var(--color-primary-default);pointer-events:none}:host ::ng-deep .ProseMirror.resize-cursor{cursor:col-resize}:host ::ng-deep .ProseMirror ul[data-type=taskList]{list-style:none;margin-left:0;padding-left:0}:host ::ng-deep .ProseMirror ul[data-type=taskList] li{display:flex;align-items:flex-start;gap:.5rem}:host ::ng-deep .ProseMirror ul[data-type=taskList] li>label{flex:0 0 auto;margin-top:.25rem;-webkit-user-select:none;user-select:none}:host ::ng-deep .ProseMirror ul[data-type=taskList] li>label input[type=checkbox]{accent-color:var(--color-primary-default);cursor:pointer}:host ::ng-deep .ProseMirror ul[data-type=taskList] li>div{flex:1 1 auto}:host ::ng-deep .ProseMirror ul[data-type=taskList] li[data-checked=true]>div{color:var(--text-hint-color);text-decoration:line-through}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i1.DomSanitizer }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { preset: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], outputFormat: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], maxHeight: [{
                type: Input
            }], characterLimit: [{
                type: Input
            }], showCharacterCount: [{
                type: Input
            }], editorClass: [{
                type: Input
            }], disabled: [{
                type: Input
            }], created: [{
                type: Output
            }], changed: [{
                type: Output
            }], focused: [{
                type: Output
            }], blurred: [{
                type: Output
            }], contentRef: [{
                type: ViewChild,
                args: ['content', { static: true }]
            }] } });
//# sourceMappingURL=rich-text-editor.component.js.map