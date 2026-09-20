import { EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ID } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentTreeStore } from '../../services/document-tree.store';
import * as i0 from "@angular/core";
/** One selectable destination row — `id: null` is the tree root. */
export interface IDocsFolderDestination {
    id: ID | null;
    name: string;
    depth: number;
    disabled: boolean;
}
/**
 * Flattened destination tree with a search box, shared by the Move dialog
 * (`01-ux-spec.md` §10.6) and the upload dialog's Destination field (§7.2) —
 * one picker, one set of rules, so "where does this go?" looks and behaves the
 * same wherever it is asked.
 *
 * Drop rules mirror the tree's `allowDrop`: FILE nodes are leaves, and nothing
 * may target a document being moved or anything inside it (`excludeIds`). The
 * upload dialog passes no `excludeIds` — a new file has no subtree to fall into.
 */
export declare class DocsFolderPickerComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly treeStore;
    /** Documents that must not be offered as a destination (move source + its subtree). */
    excludeIds: ID[];
    /** `undefined` = nothing chosen yet; `null` = the root. */
    selectedId: ID | null | undefined;
    selectedIdChange: EventEmitter<string>;
    destinations: IDocsFolderDestination[];
    search: string;
    constructor(translateService: TranslateService, treeStore: DocumentTreeStore);
    ngOnInit(): void;
    get filtered(): IDocsFolderDestination[];
    isSelected(destination: IDocsFolderDestination): boolean;
    select(destination: IDocsFolderDestination): void;
    /**
     * Builds the destination list.
     *
     * 🛑 **Never rejects.** `loadRoots()` carries no internal catch, so a failed tree
     * fetch would be an unhandled rejection *and* leave `destinations` empty — the
     * picker would then offer nothing selectable at all, not even the root.
     */
    private loadDestinations;
    private flatten;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsFolderPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsFolderPickerComponent, "gz-docs-folder-picker", never, { "excludeIds": { "alias": "excludeIds"; "required": false; }; "selectedId": { "alias": "selectedId"; "required": false; }; }, { "selectedIdChange": "selectedIdChange"; }, never, never, false, never>;
}
