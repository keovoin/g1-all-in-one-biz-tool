import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import { DocumentKnowledgeStatusEnum, DocumentStatusEnum } from '@gauzy/contracts';
import { DocumentsStore } from './documents.store';
import * as i0 from "@angular/core";
import * as i1 from "./documents.store";
/** Memoized selectors over the docs elf store. */
export class DocumentsQuery {
    constructor(documentsStore) {
        this.documentsStore = documentsStore;
        this.rows$ = this.select((state) => state.rows);
        this.totalCount$ = this.select((state) => state.totalCount);
        this.loading$ = this.select((state) => state.loading);
        this.error$ = this.select((state) => state.error);
        this.filter$ = this.select((state) => state.filter);
        this.view$ = this.select((state) => state.view);
        this.folderId$ = this.select((state) => state.folderId);
        this.selection$ = this.select((state) => state.selectedIds);
        this.detailId$ = this.select((state) => state.detailId);
        this.facets$ = this.select((state) => state.facets);
        this.presetCounts$ = this.select((state) => state.presetCounts);
        this.pagination$ = this.select((state) => state.pagination);
        /** True while any visible row is still processing or indexing — drives the 5 s poll. */
        this.isProcessingVisible$ = this.select((state) => state.rows.some((row) => row.status === DocumentStatusEnum.UPLOADED ||
            row.status === DocumentStatusEnum.PROCESSING ||
            row.knowledgeStatus === DocumentKnowledgeStatusEnum.QUEUED ||
            row.knowledgeStatus === DocumentKnowledgeStatusEnum.INDEXING));
    }
    select(project) {
        return this.documentsStore.store.pipe(select(project));
    }
    // Snapshot getters
    get rows() {
        return this.documentsStore.state.rows;
    }
    get filter() {
        return this.documentsStore.state.filter;
    }
    get view() {
        return this.documentsStore.state.view;
    }
    get folderId() {
        return this.documentsStore.state.folderId;
    }
    get selectedIds() {
        return this.documentsStore.state.selectedIds;
    }
    get detailId() {
        return this.documentsStore.state.detailId;
    }
    get pagination() {
        return this.documentsStore.state.pagination;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsQuery, deps: [{ token: i1.DocumentsStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsQuery }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsQuery, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DocumentsStore }] });
//# sourceMappingURL=documents.query.js.map