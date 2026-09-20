import { AngularNodeViewComponent } from '../node-view/angular-node-view-renderer';
import { IEditorUpload } from '../services/editor-upload.service';
import * as i0 from "@angular/core";
/**
 * Node view for `fileAttachment` (spec 05 §6.2/§6.6): file-type icon, name,
 * humanized size, download + open-in-Documents actions; uploading placeholder
 * shows a progress bar, a failed upload flips to Retry / Remove; a card that
 * never resolved a `documentId` renders the "missing" state.
 */
export declare class FileAttachmentNodeViewComponent extends AngularNodeViewComponent {
    private readonly documentsService;
    private readonly uploadService;
    private readonly router;
    private readonly changeDetectorRef;
    /** True while the signed download URL is being resolved (`OnPush` — flagged explicitly). */
    downloading: boolean;
    get documentId(): string | null;
    get name(): string;
    get upload(): IEditorUpload | undefined;
    /** No documentId and no live upload = orphaned placeholder / deleted target. */
    get isMissing(): boolean;
    get humanSize(): string;
    get icon(): string;
    /**
     * Downloads the attachment.
     *
     * 🛑 This was an `<a [href]>` straight at `GET /:id/download`. That route is a
     * JWT-guarded JSON endpoint answering `{ url }` — a plain navigation carries no
     * bearer token, so every attachment download landed on a 401. The signed
     * provider URL is resolved through the authenticated client first, then opened.
     */
    download(): Promise<void>;
    openInDocuments(): void;
    retry(): void;
    remove(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileAttachmentNodeViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileAttachmentNodeViewComponent, "gz-file-attachment-node-view", never, {}, {}, never, never, true, never>;
}
