import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID, IPagination, IProposal, IProposalCreateInput, IProposalFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProposalsService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Retrieves all proposals with optional filtering by relations and conditions.
     *
     * @param relations - An array of strings specifying the related entities to include in the results.
     * @param where - An optional object specifying the conditions to filter the proposals.
     * @returns A promise that resolves to an object containing a list of proposals and pagination details.
     */
    getAll(relations?: string[], where?: IProposalFindInput): Promise<IPagination<IProposal>>;
    /**
     * Creates a new proposal with the given input data.
     *
     * @param input - The data required to create a new proposal, conforming to the IProposalCreateInput interface.
     * @returns A promise that resolves to the newly created proposal.
     */
    create(input: IProposalCreateInput): Promise<IProposal>;
    /**
     * Updates an existing proposal with the given ID using the provided input data.
     *
     * @param id - The unique identifier of the proposal to update.
     * @param input - The data to update the proposal with, conforming to the IProposalCreateInput interface.
     * @returns A promise that resolves to the updated proposal.
     */
    update(id: ID, input: IProposalCreateInput): Promise<IProposal>;
    /**
     * Deletes a proposal with the given ID.
     *
     * @param id - The unique identifier of the proposal to delete.
     * @returns A promise that resolves to the deleted proposal.
     */
    delete(id: ID): Promise<IProposal>;
    /**
     * Retrieves a proposal by its unique ID, with optional inclusion of related entities.
     *
     * @param id - The unique identifier of the proposal to retrieve.
     * @param relations - An array of strings specifying the related entities to include in the result.
     * @returns An observable that emits the retrieved proposal, enriched with the specified relations.
     */
    getById(id: ID, relations?: string[]): Observable<IProposal>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProposalsService>;
}
