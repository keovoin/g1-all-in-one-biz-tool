import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Always-visible upload strip between the filter bar and the list — VISUAL-ONLY
 * on purpose.
 *
 * 🛑 It carries no `gzDocsUploadDropzone` of its own: the directive's `onDrop`
 * calls `preventDefault()` but never `stopPropagation()`, so a second instance
 * nested inside the page-wide one would emit `filesDropped` on the strip AND
 * bubble to the page root — two `onFilesPicked` calls, two classification
 * dialogs per drop. The page-wide directive keeps owning every drop; the strip
 * only mirrors its `dragActiveChange` via `[active]` and forwards clicks/keys to
 * the existing upload flow through `(browse)`.
 */
export declare class DocsDropStripComponent {
    /** Mirrors the page-wide dropzone's drag state (highlight while a drag hovers the page). */
    active: boolean;
    /** Live org limit (`GET /settings` capabilities via UploadQueueService), not the constant. */
    maxFileSizeBytes: number;
    maxFiles: number;
    /** The hidden file input's accept list (`.pdf,.docx,…`) — the hint derives from it. */
    set accept(value: string);
    browse: EventEmitter<void>;
    formats: string;
    get maxFileSize(): string;
    /**
     * Space activates the strip like a button — without scrolling the page
     * (preventDefault) and without key-repeat machine-gunning the file picker.
     * A typed METHOD rather than template statements: for `keydown.space`
     * pseudo-key bindings the strict template checker types `$event` too
     * narrowly to reach `KeyboardEvent.repeat` — it fails the PRODUCTION
     * (full-compilation) build only, which is exactly how it slipped past the
     * dev-config PR checks and broke the demo webapp image.
     */
    onSpace(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsDropStripComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsDropStripComponent, "gz-docs-drop-strip", never, { "active": { "alias": "active"; "required": false; }; "maxFileSizeBytes": { "alias": "maxFileSizeBytes"; "required": false; }; "maxFiles": { "alias": "maxFiles"; "required": false; }; "accept": { "alias": "accept"; "required": false; }; }, { "browse": "browse"; }, never, never, false, never>;
}
