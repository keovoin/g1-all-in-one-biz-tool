import { AfterViewInit, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IEmployee, TimeFormatEnum } from '@gauzy/contracts';
import { GalleryItem } from './gallery.directive';
import { GalleryService } from './gallery.service';
import { TimeZoneService } from '../timesheet/gauzy-filters/timezone-filter';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare const fadeInOutAnimation: import("@angular/animations").AnimationTriggerMetadata;
export declare class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly _dialogRef;
    private readonly _galleryService;
    private readonly _timeZoneService;
    active_index: number;
    items: GalleryItem[];
    item: GalleryItem;
    employeeId: IEmployee['id'];
    customScroll: ElementRef<HTMLElement>;
    galleryInner: ElementRef<HTMLElement>;
    timeZone$: Observable<string>;
    timeFormat$: Observable<TimeFormatEnum>;
    constructor(_dialogRef: NbDialogRef<GalleryComponent>, _galleryService: GalleryService, _timeZoneService: TimeZoneService);
    /**
     * Initializes the component and subscribes to changes in the items emitted by the gallery service.
     * Filters the items based on the employeeId property, if provided.
     * Sets the items property and focuses on the active item.
     */
    ngOnInit(): void;
    /**
     * Moves focus into the viewer itself rather than onto its first button, where
     * the dialog's own auto-focus put it: an arrow-key press then drew a focus ring
     * on that button. The screenshot opener turns the dialog's auto-focus off.
     */
    ngAfterViewInit(): void;
    /**
     * Steps through the screenshots with the left and right arrow keys.
     *
     * @param $event The keyboard event.
     */
    onKeydown($event: KeyboardEvent): void;
    /**
     * Closes the dialog.
     * This function is typically called to close a dialog or modal window.
     */
    close(): void;
    /**
     * Handles navigation to the next item in the list.
     * Stops event propagation to prevent parent event handlers from being triggered.
     * Updates the active index to the next index and sets the active item accordingly.
     * Ensures that the active item is visible within a scrollable container.
     *
     * @param $event The event object.
     */
    next($event: Event): void;
    /**
     * Handles navigation to the previous item in the list.
     * Stops event propagation to prevent parent event handlers from being triggered.
     * Updates the active index to the previous index and sets the active item accordingly.
     * Ensures that the active item is visible within a scrollable container.
     * @param $event The event object.
     */
    previous($event: Event): void;
    /**
     * Sets the focus on a selected item in the gallery.
     * If the selected item is found in the gallery, it becomes the active item.
     * If not found, the provided item becomes the active item.
     * Also updates the active index accordingly.
     * @param selectedItem The item to set focus on.
     */
    setFocus(selectedItem: GalleryItem): void;
    /**
     * Scrolls the filmstrip so the active thumbnail is in view.
     */
    updateActiveIndex(): void;
    /**
     * Downloads a file from the provided URL.
     * @param url The URL of the file to download.
     */
    downloadFile(url: string): void;
    /**
     * Returns the unique identifier of a thumbnail object for tracking purposes.
     * @param index The index of the current item in the array.
     * @param thumb The thumbnail object being iterated over.
     * @returns The unique identifier of the thumbnail object.
     */
    trackByThumbId(index: number, thumb: any): any;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GalleryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GalleryComponent, "ngx-gallery", never, { "item": { "alias": "item"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; }, {}, never, never, false, never>;
}
