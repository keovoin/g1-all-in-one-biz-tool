import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { DocumentVisibilityEnum, ID, IDocumentCategory, ITag } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { IDocumentUploadOptions } from '../models/docs-api.model';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/**
 * What the dialog hands back: the (possibly trimmed) batch plus the options to
 * upload it with. The file list is part of the result because the dialog lets
 * the user drop individual files from the batch — returning only the options
 * would silently upload the files they just removed.
 */
export interface IDocsUploadDialogResult {
    files: File[];
    options: IDocumentUploadOptions;
}
/**
 * Upload & classify dialog (`01-ux-spec.md` §7.2): the queued file list with
 * per-file remove, the destination folder, categories, tags, "classify with AI"
 * and "add to AI knowledge" toggles (defaults from org settings), visibility.
 * Closes with an `IDocsUploadDialogResult` (or `null` on cancel).
 *
 * 🛑 Both toggles are **per-upload overrides of the org defaults**, and both are real
 * `UploadDocumentsDTO` fields (`classifyWithAi`, `importToKnowledge`) that
 * `DocumentsService.uploadMany()` appends to the multipart body. Adding a control here
 * without adding the field on both sides gives the user a switch that does nothing —
 * `classifyWithAi` shipped that way once.
 *
 * The AI-classification toggle is hidden when the deployment reports `aiEnabled: false`
 * (`01-ux-spec.md` §7.2): with no provider the classify stage no-ops, so offering the
 * choice would be a second dead control.
 */
export declare class ClassificationDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    /** The picked/dropped batch. Editable here — each row has a remove button. */
    files: File[];
    /** Current tree location — seeds the destination picker (`01-ux-spec.md` §7.2). */
    parentId: ID | null;
    categories: IDocumentCategory[];
    categoryIds: ID[];
    tags: ITag[];
    classifyWithAi: boolean;
    importToKnowledge: boolean;
    visibility: DocumentVisibilityEnum;
    readonly visibilityEnum: typeof DocumentVisibilityEnum;
    /** Optimistic until `GET /settings` answers — a settings failure must not hide the toggle. */
    aiEnabled: boolean;
    /** Chosen destination; seeded from `parentId` so the default is "here". */
    destinationId: ID | null;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<ClassificationDialogComponent>, documentsService: DocumentsService);
    ngOnInit(): void;
    trackByFile(index: number, file: File): string;
    /** Drops one file from the batch; emptying the list disables Upload. */
    removeFile(file: File): void;
    /** Same rounding as the progress strip and the detail panel. */
    humanize(bytes: number): string;
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClassificationDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClassificationDialogComponent, "gz-docs-classification-dialog", never, { "files": { "alias": "files"; "required": false; }; "parentId": { "alias": "parentId"; "required": false; }; }, {}, never, never, false, never>;
}
