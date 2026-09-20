import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { BaseEntityEnum, ID, IDocument, IDocumentLink } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
/**
 * "Attach existing…" flow of the record-side Documents panel: search the hub by
 * name, pick one document, create the `DocumentLink` against the host record.
 *
 * The inverse of `dialogs/link-dialog.component.ts` (which starts from a document
 * and picks a record). Kept separate rather than parameterizing that one: it is a
 * different search surface — one endpoint instead of six entity services — and it
 * has to be **standalone**, because it is opened from the standalone panel mounted
 * on app pages where `DocsUiModule`'s declarations are not in scope.
 */
export declare class DocumentAttachDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    private readonly toastrService;
    private readonly store;
    /** Host record type. Required. */
    entity: BaseEntityEnum;
    /** Host record id. Required. */
    entityId: ID;
    /** Host record display name, persisted into `DocumentLink.metadata.label`. */
    entityLabel?: string;
    /** Links that already exist on the record — their documents are filtered out. */
    existing: IDocumentLink[];
    search: string;
    results: IDocument[];
    selectedId: ID | null;
    loading: boolean;
    saving: boolean;
    private readonly search$;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<DocumentAttachDialogComponent>, documentsService: DocumentsService, toastrService: ToastrService, store: Store);
    ngOnInit(): void;
    onSearchChange(term: string): void;
    /** Already-attached documents are hidden — the link write is idempotent anyway. */
    get filtered(): IDocument[];
    get canConfirm(): boolean;
    confirm(): Promise<void>;
    cancel(): void;
    iconOf(document: IDocument): string;
    trackByDocument(_: number, document: IDocument): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentAttachDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentAttachDialogComponent, "gz-document-attach-dialog", never, { "entity": { "alias": "entity"; "required": false; }; "entityId": { "alias": "entityId"; "required": false; }; "entityLabel": { "alias": "entityLabel"; "required": false; }; "existing": { "alias": "existing"; "required": false; }; }, {}, never, never, true, never>;
}
