import { DocumentVisibilityEnum, IDocument } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Name cell: thumbnail or kind icon (Eva; per-mime variants for FILE), name with
 * summary/original-filename tooltip, and inline pills (archived, private,
 * locked, version).
 *
 * The leading slot is a FIXED-size box whatever it holds, so a row keeps its height and its
 * text alignment whether the document has a generated thumbnail or not — and gaining one on
 * a later poll never shifts the column.
 */
export declare class NameCellComponent {
    rowData: IDocument & {
        isArchived?: boolean;
    };
    value: string;
    readonly visibilityEnum: typeof DocumentVisibilityEnum;
    /** Set once the thumbnail failed to load (expired signed URL, deleted object). */
    private thumbnailFailed;
    /**
     * The row's preview image, or `null` when the kind icon should stand in.
     *
     * `thumbUrl` is the virtual column the backend resolves from `storageProvider` +
     * `thumbKey`, so it is absent on every document the thumbnail job has not processed
     * (folders and pages included) — the icon is the normal case, not the error case.
     *
     * 🛑 Sanitized before it is bound: the value comes from the storage provider and lands in
     * `<img [src]>`, where Angular's own check only refuses `javascript:`
     * (`editor/read-only/safe-url.util.ts` carries the full reasoning).
     */
    get thumbnailUrl(): string | null;
    /** Falls back to the kind icon instead of leaving a broken image in the column. */
    onThumbnailError(): void;
    get tooltip(): string;
    get icon(): string;
    private fileIcon;
    static ɵfac: i0.ɵɵFactoryDeclaration<NameCellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NameCellComponent, "gz-docs-name-cell", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
