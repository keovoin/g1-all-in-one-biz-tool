import { HttpClient } from '@angular/common/http';
import { ICandidateCreateInput, ICandidateFindInput, ICandidate, ICandidateUpdateInput, IBasePerTenantAndOrganizationEntityModel, IPagination } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class CandidatesService {
    private readonly http;
    constructor(http: HttpClient);
    getAll(relations: string[], where: ICandidateFindInput): Observable<IPagination<ICandidate>>;
    getCandidateById(id: ICandidate['id'], relations?: string[], where?: ICandidateFindInput): Promise<ICandidate>;
    delete(id: ICandidate['id']): Promise<ICandidate>;
    update(id: ICandidate['id'], body: ICandidateUpdateInput): Promise<ICandidate>;
    create(body: ICandidateCreateInput): Observable<ICandidate>;
    createBulk(body: ICandidateCreateInput[]): Observable<ICandidate[]>;
    /**
     * Set candidate as archived
     *
     * @param id
     * @param body
     * @returns
     */
    setCandidateAsArchived(id: ICandidate['id'], input: IBasePerTenantAndOrganizationEntityModel): Promise<ICandidate>;
    /**
     * Set candidate hired as employee
     *
     * @param id
     * @returns
     */
    setCandidateAsHired(id: ICandidate['id']): Promise<ICandidate>;
    /**
     * Set candidate as rejected application
     *
     * @param id
     * @returns
     */
    setCandidateAsRejected(id: ICandidate['id']): Promise<ICandidate>;
    /**
     * Set candidate as applied application
     *
     * @param id
     * @returns
     */
    setCandidateAsApplied(id: ICandidate['id']): Promise<ICandidate>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidatesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidatesService>;
}
