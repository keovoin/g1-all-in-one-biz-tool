import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ProposalsService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Retrieves all proposals with optional filtering by relations and conditions.
     *
     * @param relations - An array of strings specifying the related entities to include in the results.
     * @param where - An optional object specifying the conditions to filter the proposals.
     * @returns A promise that resolves to an object containing a list of proposals and pagination details.
     */
    getAll(relations = [], where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/proposal`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Creates a new proposal with the given input data.
     *
     * @param input - The data required to create a new proposal, conforming to the IProposalCreateInput interface.
     * @returns A promise that resolves to the newly created proposal.
     */
    create(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/proposal`, input));
    }
    /**
     * Updates an existing proposal with the given ID using the provided input data.
     *
     * @param id - The unique identifier of the proposal to update.
     * @param input - The data to update the proposal with, conforming to the IProposalCreateInput interface.
     * @returns A promise that resolves to the updated proposal.
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/proposal/${id}`, input));
    }
    /**
     * Deletes a proposal with the given ID.
     *
     * @param id - The unique identifier of the proposal to delete.
     * @returns A promise that resolves to the deleted proposal.
     */
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/proposal/${id}`));
    }
    /**
     * Retrieves a proposal by its unique ID, with optional inclusion of related entities.
     *
     * @param id - The unique identifier of the proposal to retrieve.
     * @param relations - An array of strings specifying the related entities to include in the result.
     * @returns An observable that emits the retrieved proposal, enriched with the specified relations.
     */
    getById(id, relations = []) {
        return this.http.get(`${API_PREFIX}/proposal/${id}`, {
            params: toParams({ relations })
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=proposals.service.js.map