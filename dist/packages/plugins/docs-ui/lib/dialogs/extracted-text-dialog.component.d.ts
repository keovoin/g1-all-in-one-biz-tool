import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ID } from '@gauzy/contracts';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/**
 * FILE extraction correction: plain textarea over `extractedText`. Saving sets
 * `extractedTextEdited` server-side and re-chunks/re-indexes. Offered only for
 * settled (READY/FAILED) FILE documents.
 */
export declare class ExtractedTextDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    private readonly toastrService;
    documentId: ID;
    text: string;
    loading: boolean;
    saving: boolean;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<ExtractedTextDialogComponent>, documentsService: DocumentsService, toastrService: ToastrService);
    ngOnInit(): Promise<void>;
    save(): Promise<void>;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExtractedTextDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ExtractedTextDialogComponent, "gz-docs-extracted-text-dialog", never, { "documentId": { "alias": "documentId"; "required": false; }; }, {}, never, never, false, never>;
}
