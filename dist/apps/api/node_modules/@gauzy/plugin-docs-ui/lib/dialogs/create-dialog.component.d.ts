import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { DocumentKindEnum, ID } from '@gauzy/contracts';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/**
 * Minimal create/rename dialog for FOLDER and PAGE nodes (tree context menu,
 * `?newPage=1` deep link). Closes with the created/updated document or null.
 */
export declare class CreateDialogComponent extends TranslationBaseComponent {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    private readonly toastrService;
    kind: DocumentKindEnum;
    parentId: ID | null;
    /** When set, the dialog renames the existing document instead of creating. */
    renameId: ID | null;
    initialName: string;
    name: string;
    saving: boolean;
    readonly kindEnum: typeof DocumentKindEnum;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<CreateDialogComponent>, documentsService: DocumentsService, toastrService: ToastrService);
    ngOnInit(): void;
    confirm(): Promise<void>;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CreateDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CreateDialogComponent, "gz-docs-create-dialog", never, { "kind": { "alias": "kind"; "required": false; }; "parentId": { "alias": "parentId"; "required": false; }; "renameId": { "alias": "renameId"; "required": false; }; "initialName": { "alias": "initialName"; "required": false; }; }, {}, never, never, false, never>;
}
