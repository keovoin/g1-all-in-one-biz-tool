import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, NgZone, Output, PLATFORM_ID, ViewChild, afterNextRender, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Editor, Extension } from '@tiptap/core';
import { firstValueFrom } from 'rxjs';
import { stripDataUrlImages } from './extensions/base64-guard.plugin';
import { collectBlockIds, setCommentedBlocks } from './extensions/block-comments.plugin';
import { createDocumentEditorExtensions } from './extensions/document-extensions';
import { DOCS_EDITOR_SCHEMA_VERSION } from './editor.constants';
import { FloatingBlockMenuComponent } from './menus/floating-block-menu.component';
import { TableBubbleMenuComponent } from './menus/table-bubble-menu.component';
import { TextBubbleMenuComponent } from './menus/text-bubble-menu.component';
import { DocumentAutosaveService } from './services/document-autosave.service';
import { encodeContentBinary, loadCrdtEncoder } from './services/document-binary.util';
import { EditorUploadService, sanitizeContentJson } from './services/editor-upload.service';
import { SuggestionHostService } from './suggestion/suggestion-host.service';
import { collectEmployeeMentionIds } from './suggestion/employee-mention.suggestion';
import { UrlPromptDialogComponent } from './dialogs/url-prompt-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const READ_WPM = 200;
/**
 * Reads `metadata.schemaVersion` off a loaded document (spec 05 §9.1).
 *
 * `null` means the content predates the stamp — it is NOT the same as version 1, and a loader
 * shim has to treat it as "unknown, assume the oldest schema".
 */
function readSchemaVersion(document) {
    const metadata = document?.metadata;
    const version = metadata?.schemaVersion;
    return typeof version === 'number' && Number.isFinite(version) ? version : null;
}
/**
 * Tier 2 — `gz-document-editor` (spec 05 §4–§9): the full TipTap v3 block
 * editor for `Document.kind = PAGE`. JSON canonical output; autosave via
 * `DocumentAutosaveService`; uploads via `EditorUploadService`; slash menu,
 * mentions and emoji through one shared suggestion host; bubble/floating menus
 * positioned by `@floating-ui/dom`.
 */
export class DocumentEditorComponent {
    constructor() {
        this.editable = true;
        /** Every doc-changing transaction: canonical JSON + derived HTML. */
        this.contentChanged = new EventEmitter();
        this.saveStateChanged = new EventEmitter();
        this.tocChanged = new EventEmitter();
        this.statsChanged = new EventEmitter();
        this.created = new EventEmitter();
        /**
         * A block's comment thread was requested — from the bubble menu's comment action or
         * from a gutter marker (spec 05 §8). The page chrome owns the Comments rail.
         */
        this.commentRequested = new EventEmitter();
        /**
         * `metadata.schemaVersion` of the content just loaded — `null` for content saved before
         * the stamp existed (spec 05 §9.1). The page warns when it is ahead of this build.
         */
        this.schemaVersionChanged = new EventEmitter();
        this.autosave = inject(DocumentAutosaveService);
        this.uploadService = inject(EditorUploadService);
        this.suggestionHost = inject(SuggestionHostService);
        this.injector = inject(Injector);
        this.translate = inject(TranslateService);
        this.dialogService = inject(NbDialogService);
        this.announcer = inject(LiveAnnouncer);
        this.zone = inject(NgZone);
        this.cdr = inject(ChangeDetectorRef);
        this.platformId = inject(PLATFORM_ID);
        this.editor = null;
        this.invisiblesVisible = false;
        /** The document the live TipTap view and the autosave session were built for. */
        this.currentDocumentId = null;
        /**
         * `metadata.schemaVersion` of the JSON currently loaded (spec 05 §9.1). Content saved
         * before the stamp existed reads as `null`; saves always write the current version, so a
         * future loader shim can tell "pre-1" from "1" without guessing.
         */
        this.loadedSchemaVersion = null;
        /**
         * The lazily-fetched Yjs encoder behind `contentBinary`. Kicked off when the editor is
         * built so it is ready long before the 2 s debounce fires; a save that beats it simply
         * ships without the reserved field, and the next one carries it.
         */
        this.crdtEncoder = null;
        // A real DOM is required — construct only in the browser (spec 05 §3.8).
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId))
                this.createEditor();
        });
        this.autosave.state$.subscribe((state) => {
            this.saveStateChanged.emit(state);
            this.announceSaveState(state);
        });
    }
    ngOnChanges(changes) {
        if (changes['editable'] && this.editor) {
            this.editor.setEditable(this.editable);
        }
        if (changes['document'] && this.document) {
            this.uploadService.parentDocumentId = this.document.id ?? null;
            // The `page/:id` route reuses this component instance across documents:
            // without a rebuild the view keeps rendering the previous document and
            // autosave keeps writing into its id (spec 05 §9.2).
            if (this.editor && (this.document.id ?? null) !== this.currentDocumentId) {
                this.rebuildEditor();
            }
        }
    }
    ngOnDestroy() {
        this.teardownEditor();
    }
    // ─── Public API (page chrome) ────────────────────────────────
    getJSON() {
        return (this.editor ? sanitizeContentJson(this.editor.getJSON()) : null);
    }
    getHTML() {
        return this.editor?.getHTML() ?? '';
    }
    /** "Copy as Markdown" / `.md` export via `@tiptap/markdown` (spec 05 §9.3). */
    getMarkdown() {
        const storage = this.editor?.storage;
        try {
            return storage?.markdown?.getMarkdown?.() ?? this.editor?.getText() ?? '';
        }
        catch {
            return this.editor?.getText() ?? '';
        }
    }
    focus(position = 'end') {
        this.editor?.chain().focus(position).run();
    }
    /** Manual flush (Ctrl/Cmd+S, route leave). */
    flush(options = {}) {
        return this.autosave.flush(options);
    }
    /**
     * The page released the lock — resume autosaving. The 423 freeze has no
     * self-clearing path, so nothing short of a reload would lift it otherwise.
     */
    lockReleased(document) {
        this.autosave.lockReleased((document ?? this.document)?.updatedAt);
    }
    /** Replaces content without emitting (conflict reload / version restore). */
    applyRemoteContent(document) {
        if (!this.editor)
            return;
        const content = document.contentJson ?? document.contentHtml ?? '';
        this.editor.commands.setContent(content, { emitUpdate: false });
        this.loadedSchemaVersion = readSchemaVersion(document);
        this.schemaVersionChanged.emit(this.loadedSchemaVersion);
        this.autosave.resolve(document.updatedAt, { discardLocal: true });
        this.emitStats();
    }
    // ─── Block comments (spec 05 §8) ─────────────────────────────
    /**
     * Publishes the blocks that currently have an open thread; the extension turns them into
     * gutter markers. Called by the page's Comments rail — the editor never fetches comments.
     */
    setCommentedBlocks(blockIds) {
        setCommentedBlocks(this.editor, blockIds);
    }
    /** Every `blockId` in the document — lets the rail flag threads whose block was deleted. */
    getBlockIds() {
        return collectBlockIds(this.editor);
    }
    /**
     * Scrolls a block into view and flashes it (deep link `?block=` — spec 05 §8).
     *
     * @param blockId The UniqueID attribute value to look for.
     * @returns True when the block was found and highlighted.
     */
    highlightBlock(blockId) {
        const host = this.editorHostRef?.nativeElement;
        if (!host || !blockId)
            return false;
        // The attribute is rendered as `data-blockId`, which HTML lowercases; attribute-name
        // matching is case-insensitive in HTML documents, so this selector finds either form.
        const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(blockId) : blockId;
        const element = host.querySelector(`[data-blockId="${escaped}"]`);
        if (!element)
            return false;
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('gz-block-flash');
        // Self-clearing so a second deep link to the same block flashes again.
        setTimeout(() => element.classList.remove('gz-block-flash'), 2_000);
        return true;
    }
    toggleInvisibleCharacters() {
        if (!this.editor)
            return;
        this.invisiblesVisible = !this.invisiblesVisible;
        this.editor.commands.toggleInvisibleCharacters?.();
        this.cdr.markForCheck();
    }
    openFilePicker(kind) {
        const input = this.fileInputRef.nativeElement;
        input.accept = kind === 'image' ? 'image/png,image/jpeg,image/webp,image/gif' : '';
        input.value = '';
        input.onchange = () => {
            if (this.editor && input.files?.length) {
                this.uploadService.handleFiles(this.editor, input.files);
            }
            input.onchange = null;
        };
        input.click();
    }
    // ─── Editor construction ─────────────────────────────────────
    /** Swaps the whole editor stack over to `this.document` (route ':id' change). */
    rebuildEditor() {
        this.teardownEditor();
        if (isPlatformBrowser(this.platformId))
            this.createEditor();
    }
    teardownEditor() {
        this.suggestionHost.close();
        this.uploadService.destroy();
        // Unconditional destroy — leaked ProseMirror views hold DOM references (spec 05 §3.8).
        this.editor?.destroy();
        this.editor = null;
        this.currentDocumentId = null;
    }
    createEditor() {
        const extensions = createDocumentEditorExtensions({
            injector: this.injector,
            translate: this.translate,
            suggestionHost: this.suggestionHost,
            uploadService: this.uploadService,
            slashCommandDeps: {
                openFilePicker: (kind) => this.openFilePicker(kind),
                promptUrl: (titleKey) => this.promptUrl(titleKey)
            },
            onTocUpdate: (anchors) => this.zone.run(() => this.tocChanged.emit(anchors)),
            onOpenCommentThread: (blockId) => this.zone.run(() => this.commentRequested.emit(blockId)),
            collab: false
        });
        const keymap = Extension.create({
            name: 'gzEditorKeymap',
            addKeyboardShortcuts: () => ({
                // Manual flush — never the browser save dialog (spec 05 §9.2).
                'Mod-s': () => {
                    void this.zone.run(() => this.autosave.flush());
                    return true;
                },
                // Block move (spec 05 §13 keyboard equivalents for the drag handle).
                'Alt-ArrowUp': () => this.moveCurrentBlock(-1),
                'Alt-ArrowDown': () => this.moveCurrentBlock(1)
            })
        });
        // TipTap events fire outside Angular's zone; re-enter only to push state (spec 05 §3.8).
        this.zone.runOutsideAngular(() => {
            this.editor = new Editor({
                element: this.editorHostRef.nativeElement,
                editable: this.editable,
                extensions: [...extensions, keymap],
                content: this.document?.contentJson ?? this.document?.contentHtml ?? '',
                editorProps: {
                    transformPastedHTML: stripDataUrlImages,
                    attributes: {
                        role: 'textbox',
                        'aria-multiline': 'true',
                        'aria-label': this.document?.name ?? '',
                        class: 'gz-document-editor-content'
                    }
                },
                onUpdate: ({ editor, transaction }) => {
                    if (!transaction.docChanged)
                        return;
                    this.zone.run(() => {
                        this.autosave.markDirty();
                        this.contentChanged.emit({ json: this.getJSON(), html: editor.getHTML() });
                        this.emitStats();
                    });
                },
                onCreate: ({ editor }) => {
                    this.zone.run(() => {
                        this.created.emit(editor);
                        this.emitStats();
                        this.cdr.markForCheck();
                    });
                }
            });
        });
        this.currentDocumentId = this.document?.id ?? null;
        this.loadedSchemaVersion = readSchemaVersion(this.document);
        this.schemaVersionChanged.emit(this.loadedSchemaVersion);
        // Fire-and-forget: the chunk lands well inside the 2 s autosave debounce, and a
        // failure only costs the reserved `contentBinary` field.
        void loadCrdtEncoder().then((encoder) => (this.crdtEncoder = encoder));
        // `content`, `aria-label` and `currentDocumentId` above all optional-chain
        // `this.document`; this line dereferenced it bare, so the one path those guards
        // exist for (constructed via `afterNextRender` before the input is bound) threw
        // here instead. Skip the autosave session rather than start one with no id.
        if (this.document) {
            this.autosave.init(this.document.id, this.document.updatedAt, () => this.buildPayload());
        }
        this.cdr.markForCheck();
    }
    buildPayload() {
        if (!this.editor)
            return null;
        // Never save while an upload placeholder is pending (spec 05 §6.6 step 6).
        if (this.uploadService.hasPending)
            return null;
        const contentJson = this.getJSON();
        return {
            contentJson,
            contentHtml: this.editor.getHTML(),
            mentionEmployeeIds: collectEmployeeMentionIds(contentJson),
            // Stamped on every save (spec 05 §9.1) — without it, a future loader shim has no
            // discriminator and every page written today is indistinguishable from a v2 one.
            metadata: { schemaVersion: DOCS_EDITOR_SCHEMA_VERSION },
            contentBinary: encodeContentBinary(this.crdtEncoder, this.editor.schema, contentJson)
        };
    }
    emitStats() {
        const storage = this.editor?.storage;
        const characters = storage?.characterCount?.characters?.() ?? 0;
        const words = storage?.characterCount?.words?.() ?? 0;
        this.statsChanged.emit({
            characters,
            words,
            readTimeMinutes: Math.max(1, Math.ceil(words / READ_WPM))
        });
    }
    async promptUrl(titleKey) {
        const ref = this.dialogService.open(UrlPromptDialogComponent, { context: { titleKey } });
        const result = await firstValueFrom(ref.onClose);
        return typeof result === 'string' ? result : null;
    }
    /** Moves the selection's top-level block one sibling up/down. */
    moveCurrentBlock(direction) {
        const editor = this.editor;
        if (!editor || !editor.isEditable)
            return false;
        return editor.commands.command(({ state, tr, dispatch }) => {
            const { $from } = state.selection;
            const blockDepth = 1;
            if ($from.depth < blockDepth)
                return false;
            const index = $from.index(blockDepth - 1);
            const parent = $from.node(blockDepth - 1);
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= parent.childCount)
                return false;
            const from = $from.before(blockDepth);
            const node = parent.child(index);
            const sibling = parent.child(targetIndex);
            if (!dispatch)
                return true;
            const start = direction === -1 ? from - sibling.nodeSize : from;
            tr.delete(from, from + node.nodeSize);
            tr.insert(direction === -1 ? start : start + sibling.nodeSize, node);
            dispatch(tr.scrollIntoView());
            return true;
        });
    }
    announceSaveState(state) {
        const keyByState = {
            saved: 'DOCS.EDITOR.SAVED',
            saving: 'DOCS.EDITOR.SAVING',
            offline: 'DOCS.EDITOR.OFFLINE_RETRYING',
            error: 'DOCS.EDITOR.SAVE_FAILED',
            conflict: 'DOCS.EDITOR.SAVE.CONFLICT',
            locked: 'DOCS.EDITOR.LOCKED_BANNER'
        };
        const key = keyByState[state];
        if (key)
            void this.announcer.announce(this.translate.instant(key), 'polite');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentEditorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentEditorComponent, isStandalone: true, selector: "gz-document-editor", inputs: { document: "document", editable: "editable" }, outputs: { contentChanged: "contentChanged", saveStateChanged: "saveStateChanged", tocChanged: "tocChanged", statsChanged: "statsChanged", created: "created", commentRequested: "commentRequested", schemaVersionChanged: "schemaVersionChanged" }, providers: [DocumentAutosaveService, EditorUploadService, SuggestionHostService], viewQueries: [{ propertyName: "editorHostRef", first: true, predicate: ["editorHost"], descendants: true, static: true }, { propertyName: "fileInputRef", first: true, predicate: ["fileInput"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"gz-document-editor\" [class.gz-document-editor--readonly]=\"!editable\">\n\t<!-- ProseMirror mounts here -->\n\t<div #editorHost class=\"gz-editor-mount\"></div>\n\n\t<!-- Selection / table / empty-line chrome (registered as editor plugins once the editor exists) -->\n\t<ng-container *ngIf=\"editor\">\n\t\t<gz-text-bubble-menu\n\t\t\t[editor]=\"editor\"\n\t\t\t(commentRequested)=\"commentRequested.emit($event)\"\n\t\t></gz-text-bubble-menu>\n\t\t<gz-table-bubble-menu [editor]=\"editor\"></gz-table-bubble-menu>\n\t\t<gz-floating-block-menu [editor]=\"editor\"></gz-floating-block-menu>\n\t</ng-container>\n\n\t<!-- Hidden picker feeding the upload pipeline (slash image/attachment commands).\n\t     `aria-hidden` keeps it out of the accessibility tree \u2014 the label is a static\n\t     fallback only (this standalone component does not import `TranslateModule`). -->\n\t<input\n\t\t#fileInput\n\t\tid=\"gz-editor-file-input\"\n\t\ttype=\"file\"\n\t\tmultiple\n\t\tclass=\"gz-editor-file-input\"\n\t\ttabindex=\"-1\"\n\t\taria-hidden=\"true\"\n\t\taria-label=\"Upload files\"\n\t/>\n</div>\n", styles: ["@charset \"UTF-8\";.gz-document-editor{position:relative}.gz-document-editor .gz-editor-file-input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror{outline:none;position:relative;min-height:16rem;padding:.25rem 0;color:var(--text-basic-color);caret-color:var(--color-primary-default);line-height:1.6;word-wrap:break-word}:host ::ng-deep .gz-document-editor .ProseMirror>*+*{margin-top:.375rem}:host ::ng-deep .gz-document-editor .ProseMirror p.is-editor-empty:first-child:before,:host ::ng-deep .gz-document-editor .ProseMirror [data-placeholder]:before{content:attr(data-placeholder);color:var(--text-hint-color);float:left;height:0;pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror a{color:var(--color-primary-default)}:host ::ng-deep .gz-document-editor .ProseMirror blockquote{border-left:3px solid var(--color-primary-transparent-500);margin:.375rem 0;padding-left:.75rem;color:var(--text-hint-color)}:host ::ng-deep .gz-document-editor .ProseMirror hr{border:none;border-top:1px solid var(--border-basic-color-3);margin:.75rem 0}:host ::ng-deep .gz-document-editor .ProseMirror code{background:var(--background-basic-color-3);border-radius:.25rem;padding:.125rem .25rem;font-family:var(--font-family-monospace, monospace);font-size:.875em}:host ::ng-deep .gz-document-editor .ProseMirror pre{background:var(--background-basic-color-2);border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);padding:.75rem 1rem;overflow-x:auto}:host ::ng-deep .gz-document-editor .ProseMirror pre code{background:transparent;padding:0}:host ::ng-deep .gz-document-editor .ProseMirror mark{background:var(--color-warning-transparent-300);border-radius:.125rem}:host ::ng-deep .gz-document-editor .ProseMirror table{table-layout:fixed;width:100%;border-collapse:collapse;margin:.5rem 0}:host ::ng-deep .gz-document-editor .ProseMirror table th,:host ::ng-deep .gz-document-editor .ProseMirror table td{border:1px solid var(--border-basic-color-3);padding:.375rem .5rem;vertical-align:top;position:relative;min-width:3rem}:host ::ng-deep .gz-document-editor .ProseMirror table th{background:var(--background-basic-color-2);font-weight:600;text-align:left}:host ::ng-deep .gz-document-editor .ProseMirror table .selectedCell:after{content:\"\";position:absolute;inset:0;background:var(--color-primary-transparent-200);pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:-2px;width:4px;background:var(--color-primary-default);pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror .tableWrapper{overflow-x:auto}:host ::ng-deep .gz-document-editor .ProseMirror.resize-cursor{cursor:col-resize}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList]{list-style:none;padding-left:.25rem}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li{display:flex;align-items:flex-start;gap:.5rem}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li>label{margin-top:.25rem}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li>label input[type=checkbox]{accent-color:var(--color-primary-default)}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li>div{flex:1}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li[data-checked=true]>div{color:var(--text-hint-color);text-decoration:line-through}:host ::ng-deep .gz-document-editor .ProseMirror img{max-width:100%;height:auto;border-radius:var(--border-radius)}:host ::ng-deep .gz-document-editor .ProseMirror img.ProseMirror-selectednode{outline:2px solid var(--color-primary-transparent-300)}:host ::ng-deep .gz-document-editor .ProseMirror img[data-uploading=true]{opacity:.5;filter:saturate(.6)}:host ::ng-deep .gz-document-editor .ProseMirror .gz-details{border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);padding:.375rem .625rem;margin:.375rem 0}:host ::ng-deep .gz-document-editor .ProseMirror .gz-details summary{cursor:pointer;font-weight:600}:host ::ng-deep .gz-document-editor .ProseMirror .gz-employee-mention{background:var(--color-primary-transparent-100);color:var(--color-primary-default);border-radius:.25rem;padding:.0625rem .25rem;white-space:nowrap}:host ::ng-deep .gz-document-editor .ProseMirror .gz-document-mention{background:var(--background-basic-color-2);border:1px solid var(--border-basic-color-3);border-radius:.25rem;padding:.0625rem .375rem .0625rem 1.25rem;white-space:nowrap;position:relative;text-decoration:none}:host ::ng-deep .gz-document-editor .ProseMirror .gz-document-mention:before{content:\"\\1f4c4\";position:absolute;left:.25rem;font-size:.75em}:host ::ng-deep .gz-document-editor .ProseMirror .has-focus{border-radius:.125rem}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-commented{border-left:2px solid var(--color-warning-default);padding-left:.5rem;margin-left:-.625rem}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-comment-marker{position:absolute;left:-1.75rem;display:inline-flex;align-items:center;justify-content:center;width:1.25rem;height:1.25rem;padding:0;border:0;border-radius:.25rem;background:transparent;font-size:.75rem;line-height:1;cursor:pointer;opacity:.75}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-comment-marker:hover,:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-comment-marker:focus-visible{opacity:1;background:var(--background-basic-color-2)}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-flash{animation:gz-block-flash 2s ease-out}:host ::ng-deep .gz-document-editor .ProseMirror .Tiptap-invisible-character{color:var(--text-hint-color)}:host ::ng-deep .gz-document-editor .gz-drag-handle{display:grid;grid-template-columns:repeat(2,4px);gap:2px;padding:.375rem .25rem;cursor:grab;opacity:.6}:host ::ng-deep .gz-document-editor .gz-drag-handle:hover{opacity:1}:host ::ng-deep .gz-document-editor .gz-drag-handle span{width:3px;height:3px;border-radius:50%;background:var(--text-hint-color)}@keyframes gz-block-flash{0%{background:var(--color-warning-transparent-300)}to{background:transparent}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: TextBubbleMenuComponent, selector: "gz-text-bubble-menu", inputs: ["editor"], outputs: ["commentRequested"] }, { kind: "component", type: TableBubbleMenuComponent, selector: "gz-table-bubble-menu", inputs: ["editor"] }, { kind: "component", type: FloatingBlockMenuComponent, selector: "gz-floating-block-menu", inputs: ["editor"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentEditorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-document-editor', standalone: true, imports: [CommonModule, TextBubbleMenuComponent, TableBubbleMenuComponent, FloatingBlockMenuComponent], changeDetection: ChangeDetectionStrategy.OnPush, providers: [DocumentAutosaveService, EditorUploadService, SuggestionHostService], template: "<div class=\"gz-document-editor\" [class.gz-document-editor--readonly]=\"!editable\">\n\t<!-- ProseMirror mounts here -->\n\t<div #editorHost class=\"gz-editor-mount\"></div>\n\n\t<!-- Selection / table / empty-line chrome (registered as editor plugins once the editor exists) -->\n\t<ng-container *ngIf=\"editor\">\n\t\t<gz-text-bubble-menu\n\t\t\t[editor]=\"editor\"\n\t\t\t(commentRequested)=\"commentRequested.emit($event)\"\n\t\t></gz-text-bubble-menu>\n\t\t<gz-table-bubble-menu [editor]=\"editor\"></gz-table-bubble-menu>\n\t\t<gz-floating-block-menu [editor]=\"editor\"></gz-floating-block-menu>\n\t</ng-container>\n\n\t<!-- Hidden picker feeding the upload pipeline (slash image/attachment commands).\n\t     `aria-hidden` keeps it out of the accessibility tree \u2014 the label is a static\n\t     fallback only (this standalone component does not import `TranslateModule`). -->\n\t<input\n\t\t#fileInput\n\t\tid=\"gz-editor-file-input\"\n\t\ttype=\"file\"\n\t\tmultiple\n\t\tclass=\"gz-editor-file-input\"\n\t\ttabindex=\"-1\"\n\t\taria-hidden=\"true\"\n\t\taria-label=\"Upload files\"\n\t/>\n</div>\n", styles: ["@charset \"UTF-8\";.gz-document-editor{position:relative}.gz-document-editor .gz-editor-file-input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror{outline:none;position:relative;min-height:16rem;padding:.25rem 0;color:var(--text-basic-color);caret-color:var(--color-primary-default);line-height:1.6;word-wrap:break-word}:host ::ng-deep .gz-document-editor .ProseMirror>*+*{margin-top:.375rem}:host ::ng-deep .gz-document-editor .ProseMirror p.is-editor-empty:first-child:before,:host ::ng-deep .gz-document-editor .ProseMirror [data-placeholder]:before{content:attr(data-placeholder);color:var(--text-hint-color);float:left;height:0;pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror a{color:var(--color-primary-default)}:host ::ng-deep .gz-document-editor .ProseMirror blockquote{border-left:3px solid var(--color-primary-transparent-500);margin:.375rem 0;padding-left:.75rem;color:var(--text-hint-color)}:host ::ng-deep .gz-document-editor .ProseMirror hr{border:none;border-top:1px solid var(--border-basic-color-3);margin:.75rem 0}:host ::ng-deep .gz-document-editor .ProseMirror code{background:var(--background-basic-color-3);border-radius:.25rem;padding:.125rem .25rem;font-family:var(--font-family-monospace, monospace);font-size:.875em}:host ::ng-deep .gz-document-editor .ProseMirror pre{background:var(--background-basic-color-2);border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);padding:.75rem 1rem;overflow-x:auto}:host ::ng-deep .gz-document-editor .ProseMirror pre code{background:transparent;padding:0}:host ::ng-deep .gz-document-editor .ProseMirror mark{background:var(--color-warning-transparent-300);border-radius:.125rem}:host ::ng-deep .gz-document-editor .ProseMirror table{table-layout:fixed;width:100%;border-collapse:collapse;margin:.5rem 0}:host ::ng-deep .gz-document-editor .ProseMirror table th,:host ::ng-deep .gz-document-editor .ProseMirror table td{border:1px solid var(--border-basic-color-3);padding:.375rem .5rem;vertical-align:top;position:relative;min-width:3rem}:host ::ng-deep .gz-document-editor .ProseMirror table th{background:var(--background-basic-color-2);font-weight:600;text-align:left}:host ::ng-deep .gz-document-editor .ProseMirror table .selectedCell:after{content:\"\";position:absolute;inset:0;background:var(--color-primary-transparent-200);pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:-2px;width:4px;background:var(--color-primary-default);pointer-events:none}:host ::ng-deep .gz-document-editor .ProseMirror .tableWrapper{overflow-x:auto}:host ::ng-deep .gz-document-editor .ProseMirror.resize-cursor{cursor:col-resize}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList]{list-style:none;padding-left:.25rem}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li{display:flex;align-items:flex-start;gap:.5rem}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li>label{margin-top:.25rem}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li>label input[type=checkbox]{accent-color:var(--color-primary-default)}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li>div{flex:1}:host ::ng-deep .gz-document-editor .ProseMirror ul[data-type=taskList] li[data-checked=true]>div{color:var(--text-hint-color);text-decoration:line-through}:host ::ng-deep .gz-document-editor .ProseMirror img{max-width:100%;height:auto;border-radius:var(--border-radius)}:host ::ng-deep .gz-document-editor .ProseMirror img.ProseMirror-selectednode{outline:2px solid var(--color-primary-transparent-300)}:host ::ng-deep .gz-document-editor .ProseMirror img[data-uploading=true]{opacity:.5;filter:saturate(.6)}:host ::ng-deep .gz-document-editor .ProseMirror .gz-details{border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);padding:.375rem .625rem;margin:.375rem 0}:host ::ng-deep .gz-document-editor .ProseMirror .gz-details summary{cursor:pointer;font-weight:600}:host ::ng-deep .gz-document-editor .ProseMirror .gz-employee-mention{background:var(--color-primary-transparent-100);color:var(--color-primary-default);border-radius:.25rem;padding:.0625rem .25rem;white-space:nowrap}:host ::ng-deep .gz-document-editor .ProseMirror .gz-document-mention{background:var(--background-basic-color-2);border:1px solid var(--border-basic-color-3);border-radius:.25rem;padding:.0625rem .375rem .0625rem 1.25rem;white-space:nowrap;position:relative;text-decoration:none}:host ::ng-deep .gz-document-editor .ProseMirror .gz-document-mention:before{content:\"\\1f4c4\";position:absolute;left:.25rem;font-size:.75em}:host ::ng-deep .gz-document-editor .ProseMirror .has-focus{border-radius:.125rem}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-commented{border-left:2px solid var(--color-warning-default);padding-left:.5rem;margin-left:-.625rem}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-comment-marker{position:absolute;left:-1.75rem;display:inline-flex;align-items:center;justify-content:center;width:1.25rem;height:1.25rem;padding:0;border:0;border-radius:.25rem;background:transparent;font-size:.75rem;line-height:1;cursor:pointer;opacity:.75}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-comment-marker:hover,:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-comment-marker:focus-visible{opacity:1;background:var(--background-basic-color-2)}:host ::ng-deep .gz-document-editor .ProseMirror .gz-block-flash{animation:gz-block-flash 2s ease-out}:host ::ng-deep .gz-document-editor .ProseMirror .Tiptap-invisible-character{color:var(--text-hint-color)}:host ::ng-deep .gz-document-editor .gz-drag-handle{display:grid;grid-template-columns:repeat(2,4px);gap:2px;padding:.375rem .25rem;cursor:grab;opacity:.6}:host ::ng-deep .gz-document-editor .gz-drag-handle:hover{opacity:1}:host ::ng-deep .gz-document-editor .gz-drag-handle span{width:3px;height:3px;border-radius:50%;background:var(--text-hint-color)}@keyframes gz-block-flash{0%{background:var(--color-warning-transparent-300)}to{background:transparent}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { document: [{
                type: Input,
                args: [{ required: true }]
            }], editable: [{
                type: Input
            }], contentChanged: [{
                type: Output
            }], saveStateChanged: [{
                type: Output
            }], tocChanged: [{
                type: Output
            }], statsChanged: [{
                type: Output
            }], created: [{
                type: Output
            }], commentRequested: [{
                type: Output
            }], schemaVersionChanged: [{
                type: Output
            }], editorHostRef: [{
                type: ViewChild,
                args: ['editorHost', { static: true }]
            }], fileInputRef: [{
                type: ViewChild,
                args: ['fileInput', { static: true }]
            }] } });
//# sourceMappingURL=document-editor.component.js.map