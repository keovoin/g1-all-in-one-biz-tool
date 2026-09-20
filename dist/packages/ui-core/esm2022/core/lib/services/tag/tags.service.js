import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TagsService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/tags`; }
    constructor(http) {
        super(http, TagsService.API_URL);
    }
    /**
     * Get tags
     *
     * @param relations
     * @param findInput
     * @returns
     */
    getTags(where, relations = []) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/tags`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Get tags by level
     *
     * @param where
     * @param relations
     * @returns
     */
    getTagsByLevel(where, relations = []) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/tags/level`, {
            params: toParams({ ...where, relations })
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TagsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=tags.service.js.map