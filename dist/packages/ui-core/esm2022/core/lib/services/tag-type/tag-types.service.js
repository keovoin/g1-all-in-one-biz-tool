import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TagTypesService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/tag-types`; }
    constructor(http) {
        super(http, TagTypesService.API_URL);
    }
    /**
     * Get all tag types with pagination and filter options
     *
     * @param where - Filtering options
     * @param relations - Optional relations to include in the response
     * @returns A promise resolving to a paginated list of tag types
     */
    getTagTypes(where, relations = []) {
        return firstValueFrom(this.http.get(`${TagTypesService.API_URL}`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Get the count of tag types
     *
     * @param where - Optional filter criteria
     * @returns A promise resolving to the count of tag types
     */
    getTagTypesCount(where) {
        return firstValueFrom(this.http.get(`${TagTypesService.API_URL}/count`, {
            params: toParams({ where })
        }));
    }
    /**
     * Create a new tag type
     *
     * @param tagType - The tag type data to create
     * @returns A promise resolving to the created tag type
     */
    createTagType(tagType) {
        return firstValueFrom(this.http.post(`${TagTypesService.API_URL}`, tagType));
    }
    /**
     * Update an existing tag type by its ID
     *
     * @param id - The ID of the tag type to update
     * @param tagType - The new data for the tag type
     * @returns A promise resolving to the updated tag type
     */
    updateTagType(id, tagType) {
        return firstValueFrom(this.http.put(`${TagTypesService.API_URL}/${id}`, tagType));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagTypesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagTypesService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagTypesService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=tag-types.service.js.map