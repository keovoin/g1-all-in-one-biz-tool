import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ProductService {
    constructor(http) {
        this.http = http;
        this.PRODUCTS_URL = `${API_PREFIX}/products`;
    }
    getAll(relations, findInput, languageCode) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${this.PRODUCTS_URL}/local/${languageCode}`, {
            params: { data }
        }));
    }
    count(findInput) {
        const data = JSON.stringify(findInput);
        return firstValueFrom(this.http.get(`${this.PRODUCTS_URL}/count`, {
            params: { data }
        }));
    }
    getAllTranslated(options, params, languageCode) {
        const data = JSON.stringify({
            relations: options.relations,
            options: options.findInput
        });
        return firstValueFrom(this.http.get(`${this.PRODUCTS_URL}/local/${languageCode}`, {
            params: { data, ...params }
        }));
    }
    getOneTranslated(id, relations, languageCode) {
        const data = JSON.stringify({ relations });
        return firstValueFrom(this.http.get(`${this.PRODUCTS_URL}/local/${languageCode}/${id}`, { params: { data } }));
    }
    getById(id, relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${this.PRODUCTS_URL}/${id}`, {
            params: { data }
        }));
    }
    create(product) {
        return firstValueFrom(this.http.post(`${this.PRODUCTS_URL}`, product));
    }
    update(product) {
        return firstValueFrom(this.http.put(`${this.PRODUCTS_URL}/${product.id}`, product));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.PRODUCTS_URL}/${id}`));
    }
    addGalleryImages(id, images) {
        return firstValueFrom(this.http.post(`${this.PRODUCTS_URL}/add-images/${id}`, images));
    }
    deleteGalleryImage(id, image) {
        return firstValueFrom(this.http.delete(`${this.PRODUCTS_URL}/${id}/gallery-image/${image.id}`));
    }
    setAsFeatured(id, image) {
        return firstValueFrom(this.http.post(`${this.PRODUCTS_URL}/set-as-featured/${id}`, image));
    }
    deleteFeaturedImage(id) {
        return firstValueFrom(this.http.delete(`${this.PRODUCTS_URL}/featured-image/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=product.service.js.map