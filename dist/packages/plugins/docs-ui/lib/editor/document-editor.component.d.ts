import { ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Editor } from '@tiptap/core';
import { IDocument, JsonData } from '@gauzy/contracts';
import { DocumentAutosaveService, DocsSaveState } from './services/document-autosave.service';
import { EditorUploadService } from './services/editor-upload.service';
import * as i0 from "@angular/core";
export interface IEditorStats {
    characters: number;
    words: number;
    readTimeMinutes: number;
}
export interface ITocAnchor {
    id: string;
    level: number;
    textContent: string;
    isActive?: boolean;
    isScrolledOver?: boolean;
    dom?: HTMLElement;
}
/**
 * Tier 2 — `gz-document-editor` (spec 05 §4–§9): the full TipTap v3 block
 * editor for `Document.kind = PAGE`. JSON canonical output; autosave via
 * `DocumentAutosaveService`; uploads via `EditorUploadService`; slash menu,
 * mentions and emoji through one shared suggestion host; bubble/floating menus
 * positioned by `@floating-ui/dom`.
 */
export declare class DocumentEditorComponent implements OnChanges, OnDestroy {
    document: IDocument;
    editable: boolean;
    /** Every doc-changing transaction: canonical JSON + derived HTML. */
    contentChanged: EventEmitter<{
        json: JsonData;
        html: string;
    }>;
    saveStateChanged: EventEmitter<DocsSaveState>;
    tocChanged: EventEmitter<ITocAnchor[]>;
    statsChanged: EventEmitter<IEditorStats>;
    created: EventEmitter<Editor>;
    /**
     * A block's comment thread was requested — from the bubble menu's comment action or
     * from a gutter marker (spec 05 §8). The page chrome owns the Comments rail.
     */
    commentRequested: EventEmitter<string>;
    /**
     * `metadata.schemaVersion` of the content just loaded — `null` for content saved before
     * the stamp existed (spec 05 §9.1). The page warns when it is ahead of this build.
     */
    schemaVersionChanged: EventEmitter<number>;
    editorHostRef: ElementRef<HTMLElement>;
    fileInputRef: ElementRef<HTMLInputElement>;
    readonly autosave: DocumentAutosaveService;
    readonly uploadService: EditorUploadService;
    private readonly suggestionHost;
    private readonly injector;
    private readonly translate;
    private readonly dialogService;
    private readonly announcer;
    private readonly zone;
    private readonly cdr;
    private readonly platformId;
    editor: Editor | null;
    invisiblesVisible: boolean;
    /** The document the live TipTap view and the autosave session were built for. */
    private currentDocumentId;
    /**
     * `metadata.schemaVersion` of the JSON currently loaded (spec 05 §9.1). Content saved
     * before the stamp existed reads as `null`; saves always write the current version, so a
     * future loader shim can tell "pre-1" from "1" without guessing.
     */
    loadedSchemaVersion: number | null;
    /**
     * The lazily-fetched Yjs encoder behind `contentBinary`. Kicked off when the editor is
     * built so it is ready long before the 2 s debounce fires; a save that beats it simply
     * ships without the reserved field, and the next one carries it.
     */
    private crdtEncoder;
    constructor();
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    getJSON(): JsonData;
    getHTML(): string;
    /** "Copy as Markdown" / `.md` export via `@tiptap/markdown` (spec 05 §9.3). */
    getMarkdown(): string;
    focus(position?: 'start' | 'end'): void;
    /** Manual flush (Ctrl/Cmd+S, route leave). */
    flush(options?: {
        forceSnapshot?: boolean;
    }): Promise<boolean>;
    /**
     * The page released the lock — resume autosaving. The 423 freeze has no
     * self-clearing path, so nothing short of a reload would lift it otherwise.
     */
    lockReleased(document?: IDocument): void;
    /** Replaces content without emitting (conflict reload / version restore). */
    applyRemoteContent(document: IDocument): void;
    /**
     * Publishes the blocks that currently have an open thread; the extension turns them into
     * gutter markers. Called by the page's Comments rail — the editor never fetches comments.
     */
    setCommentedBlocks(blockIds: readonly string[]): void;
    /** Every `blockId` in the document — lets the rail flag threads whose block was deleted. */
    getBlockIds(): string[];
    /**
     * Scrolls a block into view and flashes it (deep link `?block=` — spec 05 §8).
     *
     * @param blockId The UniqueID attribute value to look for.
     * @returns True when the block was found and highlighted.
     */
    highlightBlock(blockId: string): boolean;
    toggleInvisibleCharacters(): void;
    openFilePicker(kind: 'image' | 'file'): void;
    /** Swaps the whole editor stack over to `this.document` (route ':id' change). */
    private rebuildEditor;
    private teardownEditor;
    private createEditor;
    private buildPayload;
    private emitStats;
    private promptUrl;
    /** Moves the selection's top-level block one sibling up/down. */
    private moveCurrentBlock;
    private announceSaveState;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentEditorComponent, "gz-document-editor", never, { "document": { "alias": "document"; "required": true; }; "editable": { "alias": "editable"; "required": false; }; }, { "contentChanged": "contentChanged"; "saveStateChanged": "saveStateChanged"; "tocChanged": "tocChanged"; "statsChanged": "statsChanged"; "created": "created"; "commentRequested": "commentRequested"; "schemaVersionChanged": "schemaVersionChanged"; }, never, never, true, never>;
}
