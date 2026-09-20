import { IDocument } from '@gauzy/contracts';
import { DocsFilterState, DocsPresetId } from '../models/docs-filter.model';
export declare class DocumentsActions {
    /** Loads the current page from the API (respects filter/folder/pagination in the store). */
    static loadDocuments: import("ts-action").FunctionWithParametersType<[options?: {
        silent?: boolean;
    }], {
        options: {
            silent?: boolean;
        };
    } & {
        type: "[Docs] Load Documents";
    }> & {
        type: "[Docs] Load Documents";
    };
    /**
     * Cards "Load more": fetches the next page and APPENDS it to `rows`
     * (`01-ux-spec.md` §4.2). Never resets pagination and never writes the URL —
     * the shareable state stays the first page.
     */
    static loadMore: (() => {
        type: "[Docs] Load More";
    }) & {
        type: "[Docs] Load More";
    };
    /** Merges a partial filter change, debounced into a reload + URL write. */
    static filterChanged: import("ts-action").FunctionWithParametersType<[filter: Partial<DocsFilterState>], {
        filter: Partial<DocsFilterState>;
    } & {
        type: "[Docs] Filter Changed";
    }> & {
        type: "[Docs] Filter Changed";
    };
    /** Toggles a preset chip (undefined = back to All). */
    static presetToggled: import("ts-action").FunctionWithParametersType<[preset?: DocsPresetId], {
        preset: DocsPresetId;
    } & {
        type: "[Docs] Preset Toggled";
    }> & {
        type: "[Docs] Preset Toggled";
    };
    /** Table/cards toggle — persisted through `ComponentEnum.DOCUMENTS_HUB`. */
    static viewChanged: import("ts-action").FunctionWithParametersType<[view: "table" | "cards"], {
        view: "table" | "cards";
    } & {
        type: "[Docs] View Changed";
    }> & {
        type: "[Docs] View Changed";
    };
    /** Tree scope change (null = root). */
    static folderChanged: import("ts-action").FunctionWithParametersType<[folderId: string], {
        folderId: string;
    } & {
        type: "[Docs] Folder Changed";
    }> & {
        type: "[Docs] Folder Changed";
    };
    static paginationChanged: import("ts-action").FunctionWithParametersType<[pagination: {
        page: number;
        pageSize: number;
    }], {
        pagination: {
            page: number;
            pageSize: number;
        };
    } & {
        type: "[Docs] Pagination Changed";
    }> & {
        type: "[Docs] Pagination Changed";
    };
    static detailOpened: import("ts-action").FunctionWithParametersType<[id: string], {
        id: string;
    } & {
        type: "[Docs] Detail Opened";
    }> & {
        type: "[Docs] Detail Opened";
    };
    static detailClosed: (() => {
        type: "[Docs] Detail Closed";
    }) & {
        type: "[Docs] Detail Closed";
    };
    static selectionChanged: import("ts-action").FunctionWithParametersType<[ids: string[]], {
        ids: string[];
    } & {
        type: "[Docs] Selection Changed";
    }> & {
        type: "[Docs] Selection Changed";
    };
    /** A single row mutated (detail edit / poll refresh) — patch it in place. */
    static rowChanged: import("ts-action").FunctionWithParametersType<[document: IDocument], {
        document: IDocument;
    } & {
        type: "[Docs] Row Changed";
    }> & {
        type: "[Docs] Row Changed";
    };
    /** A row disappeared from the current scope (archive/delete/move). */
    static rowRemoved: import("ts-action").FunctionWithParametersType<[id: string], {
        id: string;
    } & {
        type: "[Docs] Row Removed";
    }> & {
        type: "[Docs] Row Removed";
    };
    /** A bulk action finished — reload list + facets, clear selection when destructive. */
    static bulkCompleted: import("ts-action").FunctionWithParametersType<[options?: {
        destructive?: boolean;
    }], {
        options: {
            destructive?: boolean;
        };
    } & {
        type: "[Docs] Bulk Completed";
    }> & {
        type: "[Docs] Bulk Completed";
    };
    /** 5 s processing poll tick — silent in-place refresh; never writes the URL. */
    static pollTick: import("ts-action").FunctionWithParametersType<[ids?: string[]], {
        ids: string[];
    } & {
        type: "[Docs] Poll Tick";
    }> & {
        type: "[Docs] Poll Tick";
    };
    /** Refreshes facets + preset counts (on settle / after mutations). */
    static refreshFacets: (() => {
        type: "[Docs] Refresh Facets";
    }) & {
        type: "[Docs] Refresh Facets";
    };
}
