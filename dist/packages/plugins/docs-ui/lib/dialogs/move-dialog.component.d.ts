import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ID } from '@gauzy/contracts';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentTreeStore } from '../services/document-tree.store';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/**
 * Move dialog: the shared `gz-docs-folder-picker` (flattened destination tree,
 * FILE nodes and each document's own subtree disabled) plus the move call.
 * Used by row action, tree context menu and bulk move. Closes truthy when at
 * least one move succeeded.
 */
export declare class MoveDialogComponent extends TranslationBaseComponent {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly treeStore;
    private readonly documentsService;
    private readonly toastrService;
    /** Documents being moved (single row action or bulk selection). */
    documentIds: ID[];
    /** `undefined` until the user picks — `null` is the root and is a valid choice. */
    selectedId: ID | null | undefined;
    saving: boolean;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<MoveDialogComponent>, treeStore: DocumentTreeStore, documentsService: DocumentsService, toastrService: ToastrService);
    onDestinationChange(destinationId: ID | null): void;
    confirm(): Promise<void>;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MoveDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MoveDialogComponent, "gz-docs-move-dialog", never, { "documentIds": { "alias": "documentIds"; "required": false; }; }, {}, never, never, false, never>;
}
