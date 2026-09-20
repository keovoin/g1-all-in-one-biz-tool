import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ID, IDocumentCategory } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/**
 * Bulk "Set categories" dialog (`R-BLK-01` / `01-ux-spec.md` §12).
 *
 * 🛑 The bulk action is `SET_CATEGORIES` — a **replace**, not a merge: every
 * selected document ends up with exactly the categories chosen here and loses
 * the rest. Tags have separate add/remove actions precisely because they are
 * additive; categories do not, so the dialog leads with the warning rather than
 * burying it in a hint. Confirming with nothing selected clears the category set
 * of every selected document, which is a legitimate (and equally destructive)
 * use of the same action.
 *
 * Closes with `ID[]` on confirm, `null` on cancel.
 */
export declare class BulkCategoriesDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    categories: IDocumentCategory[];
    categoryIds: ID[];
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<BulkCategoriesDialogComponent>, documentsService: DocumentsService);
    ngOnInit(): void;
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BulkCategoriesDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BulkCategoriesDialogComponent, "gz-docs-bulk-categories-dialog", never, {}, {}, never, never, false, never>;
}
