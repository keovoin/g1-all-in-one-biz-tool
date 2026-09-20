import { HttpClient } from '@angular/common/http';
import { ICandidateDocumentCreateInput, ICandidateDocument, ICandidateDocumentFindInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateDocumentsService {
    private readonly http;
    constructor(http: HttpClient);
    create(createInput: ICandidateDocumentCreateInput): Promise<ICandidateDocument>;
    getAll(where: ICandidateDocumentFindInput): Promise<IPagination<ICandidateDocument>>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateDocumentsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateDocumentsService>;
}
