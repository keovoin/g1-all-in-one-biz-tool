import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { DocumentKindEnum, ID } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/** What the dialog needs to know about the node being deleted. */
export interface IDocsDeleteTarget {
    id: ID;
    name?: string;
    kind: DocumentKindEnum;
    /** Known child count, when the caller already has the list projection. */
    childrenCount?: number;
}
/** Closed with this on confirm; `null`/`undefined` on cancel or dismiss. */
export interface IDocsDeleteDialogResult {
    strategy: 'subtree' | 'promote-children';
}
/**
 * Delete prompt for an archived document (`01-ux-spec.md` §10.11).
 *
 * When the node has children the user chooses between deleting the whole
 * subtree and promoting the children one level up; with no children there is
 * nothing to choose and the dialog is a plain confirmation.
 *
 * 🛑 The chosen value leaves as `strategy` — that is the name
 * `DeleteDocumentQueryDTO` declares, and the route validates with
 * `whitelist: true`, so any other param name is stripped and the backend
 * silently falls back to `subtree`. A prompt whose answer is dropped on the
 * wire is worse than no prompt at all.
 */
export declare class DocsDeleteDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    target: IDocsDeleteTarget | null;
    /** Defaults to the backend's own default, so confirming without touching the radios is a no-surprise. */
    strategy: 'subtree' | 'promote-children';
    hasChildren: boolean;
    /** True while the child count is still being resolved — Delete waits for it. */
    resolving: boolean;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<DocsDeleteDialogComponent>, documentsService: DocumentsService);
    ngOnInit(): void;
    /**
     * Decides whether the strategy choice is offered.
     *
     * A caller holding the list projection already knows (`childrenCount`); the
     * detail panel reads the single-document endpoint, which carries no such
     * column, so the count is fetched. A FILE is a leaf by construction and never
     * costs a request. A failed count degrades to "no children" — the backend
     * default (`subtree`) is then what runs, which is exactly what happened
     * before this dialog existed.
     */
    private resolveChildren;
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsDeleteDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsDeleteDialogComponent, "gz-docs-delete-dialog", never, { "target": { "alias": "target"; "required": false; }; }, {}, never, never, false, never>;
}
