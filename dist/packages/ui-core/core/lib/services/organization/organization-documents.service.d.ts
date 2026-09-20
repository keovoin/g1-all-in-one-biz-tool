import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrganizationDocument, IOrganizationDocumentFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationDocumentsService {
    private http;
    constructor(http: HttpClient);
    create(newDocument: IOrganizationDocument): Observable<IOrganizationDocument>;
    getAll(findInput: IOrganizationDocumentFindInput): Observable<{
        items: IOrganizationDocument[];
        total: number;
    }>;
    update(id: string, updateInput: IOrganizationDocument): Observable<IOrganizationDocument>;
    delete(id: string): Observable<IOrganizationDocument>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationDocumentsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationDocumentsService>;
}
