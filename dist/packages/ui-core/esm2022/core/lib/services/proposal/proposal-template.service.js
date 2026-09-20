import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ProposalTemplateService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/employee-proposal-template`;
    }
    /**
     * Fetches all employee proposal templates based on the given request parameters.
     *
     * @param request - An optional object containing query parameters to filter and sort the results.
     * @returns A promise that resolves with a pagination object containing the list of employee proposal templates.
     */
    getAll(request = {}) {
        return firstValueFrom(this.http.get(this.API_URL, {
            params: toParams(request)
        }));
    }
    /**
     * Creates a new employee proposal template with the provided input data.
     *
     * @param input - An object containing the data for the new employee proposal template.
     * @returns A promise that resolves with the created employee proposal template.
     */
    create(input) {
        return firstValueFrom(this.http.post(this.API_URL, input));
    }
    /**
     * Updates an existing employee proposal template with the given ID using the provided data.
     *
     * @param id - The ID of the employee proposal template to update.
     * @param request - An object containing the updated data for the employee proposal template.
     * @returns A promise that resolves with the updated employee proposal template.
     */
    update(id, request) {
        return firstValueFrom(this.http.put(`${this.API_URL}/${id}`, request));
    }
    /**
     * Sets the specified employee proposal template as the default template.
     *
     * @param id - The ID of the employee proposal template to set as default.
     * @param input - An object containing any additional data required for making the template default.
     * @returns A promise that resolves with the updated employee proposal template.
     */
    makeDefault(id, input) {
        return firstValueFrom(this.http.patch(`${this.API_URL}/${id}/make-default`, input));
    }
    /**
     * Deletes the employee proposal template with the specified ID.
     *
     * @param id - The ID of the employee proposal template to delete.
     * @returns A promise that resolves when the employee proposal template has been deleted.
     */
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.API_URL}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProposalTemplateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=proposal-template.service.js.map