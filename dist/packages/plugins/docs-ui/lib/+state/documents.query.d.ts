import { Observable } from 'rxjs';
import { ID, IDocument } from '@gauzy/contracts';
import { IDocumentFacets } from '../models/docs-api.model';
import { DocsFilterState } from '../models/docs-filter.model';
import { DocsPresetCounts, DocumentsStore } from './documents.store';
import * as i0 from "@angular/core";
/** Memoized selectors over the docs elf store. */
export declare class DocumentsQuery {
    private readonly documentsStore;
    constructor(documentsStore: DocumentsStore);
    private select;
    readonly rows$: Observable<IDocument[]>;
    readonly totalCount$: Observable<number>;
    readonly loading$: Observable<boolean>;
    readonly error$: Observable<boolean>;
    readonly filter$: Observable<DocsFilterState>;
    readonly view$: Observable<'table' | 'cards'>;
    readonly folderId$: Observable<ID | null>;
    readonly selection$: Observable<ID[]>;
    readonly detailId$: Observable<ID | null>;
    readonly facets$: Observable<IDocumentFacets | null>;
    readonly presetCounts$: Observable<DocsPresetCounts | null>;
    readonly pagination$: Observable<{
        page: number;
        pageSize: number;
    }>;
    /** True while any visible row is still processing or indexing — drives the 5 s poll. */
    readonly isProcessingVisible$: Observable<boolean>;
    get rows(): IDocument[];
    get filter(): DocsFilterState;
    get view(): 'table' | 'cards';
    get folderId(): ID | null;
    get selectedIds(): ID[];
    get detailId(): ID | null;
    get pagination(): {
        page: number;
        pageSize: number;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentsQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocumentsQuery>;
}
