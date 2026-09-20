import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GalleryItem } from './gallery.directive';
import * as i0 from "@angular/core";
export declare class GalleryService {
    private readonly http;
    dataStore: GalleryItem[];
    items: GalleryItem[];
    private _items;
    get items$(): Observable<GalleryItem[]>;
    constructor(http: HttpClient);
    /**
     * Append one or multiple gallery items to the data store and push them to the gallery.
     *
     * @param galleryItems The gallery item or array of gallery items to append.
     */
    appendItems(galleryItems: GalleryItem | GalleryItem[]): void;
    /**
     * Remove gallery images associated with deleted timeslot/timelog.
     *
     * @param galleryItems The gallery item or array of gallery items to remove.
     */
    removeGalleryItems(galleryItems: GalleryItem | GalleryItem[]): void;
    /**
     * Updates the data store with unique GalleryItem objects based on their fullUrl,
     * and emits the updated data store using a BehaviorSubject.
     */
    pushToGallery(): void;
    clearGallery(): void;
    downloadFile(url: string): Observable<Blob>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GalleryService>;
}
