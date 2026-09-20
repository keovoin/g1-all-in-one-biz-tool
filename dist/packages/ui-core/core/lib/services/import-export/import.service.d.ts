import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID, IImportHistory, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ImportService {
    private readonly http;
    private _history$;
    history$: Observable<IImportHistory[]>;
    constructor(http: HttpClient);
    /**
     * Fetches import history from the server and updates the history observable.
     * @returns Observable of IPagination<IImportHistory>
     */
    getHistory(): Observable<IPagination<IImportHistory>>;
    /**
     * Downloads the archive one import was made from.
     *
     * Goes through the authenticated API rather than a storage URL: the archive is a full tenant data
     * dump and is no longer reachable at a public link.
     *
     * @param id - The import-history row.
     * @returns Observable of the archive's bytes.
     */
    downloadArchive(id: ID): Observable<Blob>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImportService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ImportService>;
}
