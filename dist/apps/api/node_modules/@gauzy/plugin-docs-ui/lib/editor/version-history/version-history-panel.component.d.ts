import { EventEmitter, OnInit } from '@angular/core';
import { ID, IDocument, IDocumentVersion } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Version history panel (UX spec §10.7, spec 05 §9.4): `DocumentVersion`
 * snapshots newest first; selecting one shows a read-only static render;
 * Restore is non-destructive (the server snapshots current content first) and
 * uses an inline two-step confirm stating exactly that.
 */
export declare class VersionHistoryPanelComponent implements OnInit {
    documentId: ID;
    closed: EventEmitter<void>;
    /** Emits the restored document — the editor reloads content from it. */
    restored: EventEmitter<IDocument>;
    private readonly documentsService;
    private readonly toastrService;
    private readonly translate;
    private readonly cdr;
    versions: IDocumentVersion[];
    selected: IDocumentVersion | null;
    selectedSnapshot: IDocumentVersion | null;
    loading: boolean;
    loadError: boolean;
    restoring: boolean;
    confirmingRestore: boolean;
    ngOnInit(): void;
    load(): Promise<void>;
    select(version: IDocumentVersion): Promise<void>;
    restore(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<VersionHistoryPanelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VersionHistoryPanelComponent, "gz-docs-version-history", never, { "documentId": { "alias": "documentId"; "required": true; }; }, { "closed": "closed"; "restored": "restored"; }, never, never, true, never>;
}
