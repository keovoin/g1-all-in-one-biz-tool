import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EventTypeService {
    constructor(http) {
        this.http = http;
        this.API_BASE_URI = `${API_PREFIX}/event-type`;
    }
    /**
     * Creates a new event type.
     *
     * @param input - The input data to create a new event type.
     * @returns An observable of the created event type.
     */
    create(input) {
        return firstValueFrom(this.http.post(this.API_BASE_URI, input));
    }
    /**
     * Gets an event type by ID.
     *
     * @param id - The ID of the event type to get.
     * @param relations - Optional array of relations to include in the response.
     * @returns An observable of the event type.
     */
    getEventTypeById(id, relations) {
        const data = JSON.stringify({ relations });
        return firstValueFrom(this.http.get(`${this.API_BASE_URI}/${id}`, {
            params: { data }
        }));
    }
    /**
     * Gets all event types.
     *
     * @param relations
     * @param findInput
     * @returns
     */
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(this.API_BASE_URI, {
            params: { data }
        }));
    }
    /**
     * Updates an event type.
     *
     * @param id
     * @param input
     * @returns
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${this.API_BASE_URI}/${id}`, input));
    }
    /**
     * Deletes an event type.
     *
     * @param id
     * @returns
     */
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.API_BASE_URI}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EventTypeService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EventTypeService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EventTypeService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=event-type.service.js.map