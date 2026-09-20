import { HttpClient } from '@angular/common/http';
import { IChangelog, IChangelogFindInput, IPagination } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ChangelogService {
    private readonly http;
    private _changelogs$;
    changelogs$: Observable<IChangelog[]>;
    constructor(http: HttpClient);
    getAll(request: IChangelogFindInput): Observable<IPagination<IChangelog>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChangelogService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ChangelogService>;
}
