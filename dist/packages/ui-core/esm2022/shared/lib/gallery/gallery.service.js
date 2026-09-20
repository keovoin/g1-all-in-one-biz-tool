import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { uniq } from 'underscore';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class GalleryService {
    get items$() {
        return this._items.asObservable();
    }
    constructor(http) {
        this.http = http;
        this.dataStore = [];
        this.items = [];
        this._items = new BehaviorSubject([]);
    }
    /**
     * Append one or multiple gallery items to the data store and push them to the gallery.
     *
     * @param galleryItems The gallery item or array of gallery items to append.
     */
    appendItems(galleryItems) {
        if (!galleryItems)
            return; // Exit early if galleryItems is falsy
        if (Array.isArray(galleryItems)) {
            this.dataStore = this.dataStore.concat(galleryItems);
        }
        else {
            this.dataStore.push(galleryItems);
        }
        this.pushToGallery();
    }
    /**
     * Remove gallery images associated with deleted timeslot/timelog.
     *
     * @param galleryItems The gallery item or array of gallery items to remove.
     */
    removeGalleryItems(galleryItems) {
        if (!galleryItems)
            return; // Exit early if galleryItems is falsy
        const items = Array.isArray(galleryItems) ? [...galleryItems] : [galleryItems];
        const idsToRemove = items.map(item => item.id);
        this.dataStore = this.dataStore.filter(item => !idsToRemove.includes(item.id));
        this.pushToGallery();
    }
    /**
     * Updates the data store with unique GalleryItem objects based on their fullUrl,
     * and emits the updated data store using a BehaviorSubject.
     */
    pushToGallery() {
        this.dataStore = uniq(this.dataStore, (item) => item.id);
        this._items.next(this.dataStore);
    }
    /*
     * Clear all screenshots after destroy component
     */
    clearGallery() {
        this.dataStore = [];
        this._items.next(this.dataStore);
    }
    /*
     * Convert blob data from file url
     */
    downloadFile(url) {
        return this.http.get(url, { responseType: 'blob' });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }], propDecorators: { items: [{
                type: Input
            }] } });
//# sourceMappingURL=gallery.service.js.map