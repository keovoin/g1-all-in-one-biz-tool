import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ImportService {
    constructor(http) {
        this.http = http;
        this._history$ = new BehaviorSubject([]);
        this.history$ = this._history$.asObservable();
    }
    /**
     * Fetches import history from the server and updates the history observable.
     * @returns Observable of IPagination<IImportHistory>
     */
    getHistory() {
        return this.http
            .get(`${API_PREFIX}/import/history`)
            .pipe(tap(({ items }) => this._history$.next(items)));
    }
    /**
     * Downloads the archive one import was made from.
     *
     * Goes through the authenticated API rather than a storage URL: the archive is a full tenant data
     * dump and is no longer reachable at a public link.
     *
     * @param id - The import-history row.
     * @returns Observable of the archive's bytes.
     */
    downloadArchive(id) {
        return this.http.get(`${API_PREFIX}/import/history/${id}/download`, { responseType: 'blob' });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImportService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImportService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImportService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=import.service.js.map