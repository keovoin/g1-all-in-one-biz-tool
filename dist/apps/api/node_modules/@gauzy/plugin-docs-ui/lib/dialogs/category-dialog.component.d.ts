import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IDocumentCategory } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/** What the dialog resolves with on confirm (`null` on cancel). */
export type IDocsCategoryDialogResult = Pick<IDocumentCategory, 'name' | 'color' | 'description'>;
/**
 * Create / rename a document category (`03-backend-plugin.md` §4.11). Standalone
 * so the settings page — which is lazily loaded outside `DocsUiModule` — can use
 * it without pulling the whole browse chunk.
 *
 * `slug` is deliberately never edited here: the backend derives it on create and
 * treats it as immutable for `isSystem` rows.
 */
export declare class CategoryDialogComponent implements OnInit {
    private readonly dialogRef;
    /** Existing row to edit; omit to create. */
    category: IDocumentCategory | null;
    name: string;
    color: string;
    description: string;
    constructor(dialogRef: NbDialogRef<CategoryDialogComponent>);
    ngOnInit(): void;
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CategoryDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CategoryDialogComponent, "gz-docs-category-dialog", never, { "category": { "alias": "category"; "required": false; }; }, {}, never, never, true, never>;
}
