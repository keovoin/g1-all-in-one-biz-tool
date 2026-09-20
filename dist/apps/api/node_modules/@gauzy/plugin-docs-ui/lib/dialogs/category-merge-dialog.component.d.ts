import { NbDialogRef } from '@nebular/theme';
import { ID, IDocumentCategory } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Merge a category into another (`POST /categories/:id/merge`): every document
 * assignment is re-pointed to the target and the source is soft-deleted. The
 * source itself is excluded from the target list — the backend rejects a
 * self-merge with a 400 and there is no reason to offer it.
 */
export declare class CategoryMergeDialogComponent {
    private readonly dialogRef;
    /** Category being merged away. */
    source: IDocumentCategory | null;
    /** Candidate targets (the caller filters the source out). */
    targets: IDocumentCategory[];
    targetId: ID | null;
    constructor(dialogRef: NbDialogRef<CategoryMergeDialogComponent>);
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CategoryMergeDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CategoryMergeDialogComponent, "gz-docs-category-merge-dialog", never, { "source": { "alias": "source"; "required": false; }; "targets": { "alias": "targets"; "required": false; }; }, {}, never, never, true, never>;
}
