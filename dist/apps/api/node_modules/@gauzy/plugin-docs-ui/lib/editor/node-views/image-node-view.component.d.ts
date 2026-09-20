import { DoCheck, OnDestroy } from '@angular/core';
import { AngularNodeViewComponent } from '../node-view/angular-node-view-renderer';
import { IEditorUpload } from '../services/editor-upload.service';
import * as i0 from "@angular/core";
/**
 * Node view for `image` (spec 05 §6.6 step 5).
 *
 * 🛑 The persisted `src` is the authenticated stream `/api/plugins/docs/documents/{id}/raw`,
 * which is guarded by `@Permissions(DOCS_READ)` and a header-only JWT strategy. A bare
 * `<img src>` carries no `Authorization` header, so every embedded image rendered straight
 * from the attribute came back 401 and displayed broken. This view keeps `/raw` in the
 * document (it is the stable, shareable reference) and renders bytes fetched through the
 * authenticated `HttpClient` as an object URL — the same trick
 * `file-attachment-node-view.component.ts` uses for downloads.
 *
 * The uploading placeholder is unchanged: it has no `documentId` yet and its `src` is the
 * local blob preview, which is bound as-is behind the shared media-URL scheme allowlist.
 */
export declare class ImageNodeViewComponent extends AngularNodeViewComponent implements DoCheck, OnDestroy {
    private readonly documentsService;
    private readonly uploadService;
    private readonly changeDetectorRef;
    /** What the `<img>` actually binds — an object URL, a blob preview, or `null` while resolving. */
    displaySrc: string | null;
    /** True once the bytes could not be fetched (deleted document, revoked access, network). */
    failed: boolean;
    private objectUrl;
    /** `IImageSource.key` of the attributes currently resolved — re-resolving is skipped while equal. */
    private resolvedKey;
    /**
     * Bumped by every resolve. `update()` patches the `node` input in place, so a slow
     * response for the previous document id must never overwrite a newer one's URL.
     */
    private resolveSession;
    /**
     * The renderer patches the `node` input and calls `detectChanges()` on every same-type
     * update (the placeholder→final upload swap being the one that matters), so the source
     * is re-derived here rather than in `ngOnChanges` — signal inputs set through
     * `ComponentRef.setInput` do not produce `SimpleChanges` on this component.
     */
    ngDoCheck(): void;
    ngOnDestroy(): void;
    get alt(): string;
    get width(): string | null;
    get align(): string | null;
    get upload(): IEditorUpload | undefined;
    retry(): void;
    remove(): void;
    /**
     * Points the `<img>` at something the browser can actually load.
     *
     * A `documentId` (or a `/raw` src it can be read out of) means the bytes live behind the
     * authenticated route — fetch them once and bind the object URL. Anything else (the blob
     * preview of an in-flight upload, an external https image) is bound directly, behind the
     * shared scheme allowlist.
     */
    private syncSource;
    private releaseObjectUrl;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageNodeViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ImageNodeViewComponent, "gz-image-node-view", never, {}, {}, never, never, true, never>;
}
