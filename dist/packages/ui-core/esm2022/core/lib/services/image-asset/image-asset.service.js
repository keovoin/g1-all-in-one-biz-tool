import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ImageAssetService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/image-assets`; }
    constructor(http) {
        super(http, ImageAssetService.API_URL);
    }
    createImageAsset(imageAsset) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/image-assets`, imageAsset));
    }
    getAll(where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/image-assets`, {
            params: toParams({ where })
        }));
    }
    deleteImageAsset(imageAsset) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/image-assets/${imageAsset.id}`));
    }
    updateImageAsset(imageAsset) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/image-assets/${imageAsset.id}`, imageAsset));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageAssetService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageAssetService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ImageAssetService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=image-asset.service.js.map