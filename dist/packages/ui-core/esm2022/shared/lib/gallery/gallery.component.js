import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NbDialogRef } from '@nebular/theme';
import { filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { saveAs } from 'file-saver';
import { sortBy } from 'underscore';
import { GalleryService } from './gallery.service';
import { TimeZoneService } from '../timesheet/gauzy-filters/timezone-filter';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "./gallery.service";
import * as i3 from "../timesheet/gauzy-filters/timezone-filter";
import * as i4 from "../directives/img.directive";
import * as i5 from "@angular/common";
import * as i6 from "../pipes/date-format.pipe";
import * as i7 from "../pipes/time-format.pipe";
import * as i8 from "../pipes/utc-to-timezone.pipe";
import * as i9 from "@ngx-translate/core";
export const fadeInOutAnimation = trigger('fadeInOut', [
    transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
    ]),
    transition(':leave', [
        // :leave is alias to '* => void'
        animate(300, style({ opacity: 0 }))
    ])
]);
let GalleryComponent = class GalleryComponent {
    constructor(_dialogRef, _galleryService, _timeZoneService) {
        this._dialogRef = _dialogRef;
        this._galleryService = _galleryService;
        this._timeZoneService = _timeZoneService;
        this.items = [];
        this.timeZone$ = this._timeZoneService.timeZone$.pipe(filter((timeZone) => !!timeZone));
        this.timeFormat$ = this._timeZoneService.timeFormat$.pipe(filter((timeFormat) => !!timeFormat));
    }
    /**
     * Initializes the component and subscribes to changes in the items emitted by the gallery service.
     * Filters the items based on the employeeId property, if provided.
     * Sets the items property and focuses on the active item.
     */
    ngOnInit() {
        // Subscribe to changes in the items emitted by the gallery service
        this._galleryService.items$
            .pipe(untilDestroyed(this)) // Unsubscribe when the component is destroyed
            .subscribe((items) => {
            // Filter the items based on the employeeId property, if provided
            if (this.employeeId) {
                items = items.filter((item) => item.employeeId === this.employeeId);
            }
            // In time order: the store holds them in the order each card added them,
            // so previous/next used to jump back and forth in time. Items without a
            // `recordedAt` (product images) keep their order.
            this.items = sortBy(items, 'recordedAt');
            // Set the focus on the active item
            this.setFocus(this.item);
        });
    }
    /**
     * Moves focus into the viewer itself rather than onto its first button, where
     * the dialog's own auto-focus put it: an arrow-key press then drew a focus ring
     * on that button. The screenshot opener turns the dialog's auto-focus off.
     */
    ngAfterViewInit() {
        this.galleryInner.nativeElement.focus({ preventScroll: true });
    }
    /**
     * Steps through the screenshots with the left and right arrow keys.
     *
     * @param $event The keyboard event.
     */
    onKeydown($event) {
        if ($event.key === 'ArrowLeft' && this.active_index > 0) {
            this.previous($event);
        }
        else if ($event.key === 'ArrowRight' && this.active_index < this.items.length - 1) {
            this.next($event);
        }
    }
    /**
     * Closes the dialog.
     * This function is typically called to close a dialog or modal window.
     */
    close() {
        // Close the dialog
        this._dialogRef.close();
    }
    /**
     * Handles navigation to the next item in the list.
     * Stops event propagation to prevent parent event handlers from being triggered.
     * Updates the active index to the next index and sets the active item accordingly.
     * Ensures that the active item is visible within a scrollable container.
     *
     * @param $event The event object.
     */
    next($event) {
        // Stop event propagation to prevent parent event handlers from being triggered
        $event.stopPropagation();
        // Update the active index to the next index within the bounds of the item list
        this.active_index = Math.min(this.active_index + 1, this.items.length - 1);
        // Set the active item based on the updated active index
        this.item = this.items[this.active_index];
        // Ensure that the active item is visible within a scrollable container
        this.updateActiveIndex();
    }
    /**
     * Handles navigation to the previous item in the list.
     * Stops event propagation to prevent parent event handlers from being triggered.
     * Updates the active index to the previous index and sets the active item accordingly.
     * Ensures that the active item is visible within a scrollable container.
     * @param $event The event object.
     */
    previous($event) {
        // Stop event propagation to prevent parent event handlers from being triggered
        $event.stopPropagation();
        // Update the active index to the previous index within the bounds of the item list
        this.active_index = Math.max(this.active_index - 1, 0);
        // Set the active item based on the updated active index
        this.item = this.items[this.active_index];
        // Ensure that the active item is visible within a scrollable container
        this.updateActiveIndex();
    }
    /**
     * Sets the focus on a selected item in the gallery.
     * If the selected item is found in the gallery, it becomes the active item.
     * If not found, the provided item becomes the active item.
     * Also updates the active index accordingly.
     * @param selectedItem The item to set focus on.
     */
    setFocus(selectedItem) {
        // Find the item with the same fullUrl as the selectedItem
        const foundItem = this.items.find((item) => item.id === selectedItem.id);
        if (foundItem) {
            // If the found item exists, set it as the active item and update the active index
            this.item = foundItem;
            this.active_index = this.items.indexOf(foundItem);
        }
        else {
            // If the selected item is not found in the gallery, set the provided item as the active item
            this.item = selectedItem;
        }
        // Update the active index
        this.updateActiveIndex();
    }
    /**
     * Scrolls the filmstrip so the active thumbnail is in view.
     */
    updateActiveIndex() {
        // Deferred to the next frame: the `thumb-item-active` class only moves to the
        // new thumbnail once change detection has run, so looking it up right away
        // found the PREVIOUS one.
        requestAnimationFrame(() => {
            const activeItem = this.customScroll.nativeElement.querySelector('.thumb-item-active');
            // Centres the active thumbnail in the filmstrip. The stylesheet's reduced-motion
            // query cannot reach a scripted scroll, so it jumps rather than glides there.
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            activeItem?.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        });
    }
    /**
     * Downloads a file from the provided URL.
     * @param url The URL of the file to download.
     */
    downloadFile(url) {
        if (!url) {
            return;
        }
        this._galleryService.downloadFile(url).subscribe((blob) => {
            const fileName = url.substring(url.lastIndexOf('/') + 1);
            saveAs(blob, fileName);
        });
    }
    /**
     * Returns the unique identifier of a thumbnail object for tracking purposes.
     * @param index The index of the current item in the array.
     * @param thumb The thumbnail object being iterated over.
     * @returns The unique identifier of the thumbnail object.
     */
    trackByThumbId(index, thumb) {
        return thumb.id;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.GalleryService }, { token: i3.TimeZoneService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GalleryComponent, isStandalone: false, selector: "ngx-gallery", inputs: { item: "item", employeeId: "employeeId" }, host: { listeners: { "document:keydown": "onKeydown($event)" } }, viewQueries: [{ propertyName: "customScroll", first: true, predicate: ["customScroll"], descendants: true, static: true }, { propertyName: "galleryInner", first: true, predicate: ["galleryInner"], descendants: true, static: true }], ngImport: i0, template: "<div class=\"gallery-inner\" tabindex=\"-1\" #galleryInner [@fadeInOut]>\n\t@let recordedTime = item?.recordedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async);\n\t<!-- When the active screenshot was taken, its place in the set, and the actions. -->\n\t<header class=\"gallery-header\">\n\t\t<!-- Product images (Inventory) carry no recorded time; only the counter shows. -->\n\t\t<div class=\"gallery-heading\">\n\t\t\t@if (item?.recordedAt) {\n\t\t\t<span class=\"gallery-title\">\n\t\t\t\t{{ item?.recordedAt | utcToTimezone : (timeZone$ | async) | dateFormat }}\n\t\t\t</span>\n\t\t\t}\n\t\t\t<span class=\"gallery-subtitle\">\n\t\t\t\t@if (item?.recordedAt) {\n\t\t\t\t{{ recordedTime }}\n\t\t\t\t}\n\t\t\t\t@if (active_index >= 0 && items.length > 0) {\n\t\t\t\t<span class=\"gallery-counter\">{{ active_index + 1 }} / {{ items.length }}</span>\n\t\t\t\t}\n\t\t\t</span>\n\t\t</div>\n\t\t<div class=\"gallery-actions\">\n\t\t\t@if (item?.description) {\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gallery-button\"\n\t\t\t\t[nbTooltip]=\"item?.description\"\n\t\t\t\t[attr.aria-label]=\"'REPORT_PAGE.DESCRIPTION' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t}\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gallery-button\"\n\t\t\t\t(click)=\"downloadFile(item?.fullUrl)\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.DOWNLOAD' | translate\"\n\t\t\t\t[attr.aria-label]=\"'BUTTONS.DOWNLOAD' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<span class=\"gallery-actions-divider\"></span>\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gallery-button close\"\n\t\t\t\t(click)=\"close()\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</header>\n\n\t<!-- A click on the dark stage around the screenshot closes the viewer. -->\n\t<div class=\"gallery-content\" (click)=\"close()\">\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"gallery-nav previous\"\n\t\t\t[disabled]=\"active_index == 0\"\n\t\t\t(click)=\"previous($event)\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.PREVIOUS' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t</button>\n\t\t<div class=\"media-viewer\">\n\t\t\t<!-- A new <img> per screenshot, not one whose src changes: the shared img\n\t\t\t     directive swaps in the fallback picture only for an element's first\n\t\t\t     failed load, so the next broken screenshot showed a 16px broken icon. -->\n\t\t\t@for (media of [item]; track media?.id) {\n\t\t\t<!-- The frame carries the work-related ring, so dimming the placeholder\n\t\t\t     picture inside it does not dim the ring too. -->\n\t\t\t<div\n\t\t\t\tclass=\"media-frame\"\n\t\t\t\t[class.not-work-related]=\"media?.isWorkRelated === false\"\n\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t>\n\t\t\t\t<img\n\t\t\t\t\tclass=\"media\"\n\t\t\t\t\tdraggable=\"false\"\n\t\t\t\t\t[src]=\"media?.fullUrl\"\n\t\t\t\t\t[alt]=\"media?.description || ((media?.recordedAt ? 'TIMESHEET.SCREENSHOTS.TAKEN_AT' : 'TIMESHEET.SCREENSHOTS.POSITION') | translate : { time: recordedTime, position: active_index + 1, total: items.length })\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"gallery-nav next\"\n\t\t\t[disabled]=\"active_index == items.length - 1\"\n\t\t\t(click)=\"next($event)\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.NEXT' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\n\t<footer class=\"gallery-footer\">\n\t\t<div class=\"thumb-items custom-scroll\" #customScroll>\n\t\t\t@for (thumb of items; track trackByThumbId(index, thumb); let index = $index) {\n\t\t\t@let thumbTime = thumb?.recordedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false;\n\t\t\t<!-- Named by its place in the set, which stays unique when there is no time. -->\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"thumb-item\"\n\t\t\t\t[class.thumb-item-active]=\"item?.id === thumb?.id\"\n\t\t\t\t[class.not-work-related]=\"thumb?.isWorkRelated === false\"\n\t\t\t\t[attr.aria-pressed]=\"item?.id === thumb?.id\"\n\t\t\t\t[attr.aria-label]=\"('TIMESHEET.SCREENSHOTS.POSITION' | translate : { position: index + 1, total: items.length }) + (thumb?.recordedAt ? ', ' + thumbTime : '')\"\n\t\t\t\t(click)=\"setFocus(thumb)\"\n\t\t\t>\n\t\t\t\t<span class=\"thumb-frame\">\n\t\t\t\t\t@if (thumb) {\n\t\t\t\t\t<img draggable=\"false\" [src]=\"thumb?.thumbUrl\" alt=\"\" />\n\t\t\t\t\t}\n\t\t\t\t</span>\n\t\t\t\t@if (thumb?.recordedAt) {\n\t\t\t\t<span class=\"thumb-time\">{{ thumbTime }}</span>\n\t\t\t\t}\n\t\t\t</button>\n\t\t\t}\n\t\t</div>\n\t</footer>\n</div>\n", styles: [":host{display:block;height:100%}.gallery-inner{display:grid;grid-template-rows:auto minmax(0,1fr) auto;height:100%;background-color:#000000e6;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);color:#ffffffeb}.gallery-inner:focus{outline:none}.gallery-header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.75rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08)}.gallery-heading{display:flex;flex-direction:column;gap:.25rem;min-width:0}.gallery-title{font-size:14px;font-weight:600;line-height:1.25rem;color:#ffffffeb}.gallery-subtitle{display:flex;align-items:center;gap:.625rem;font-size:12px;line-height:1rem;font-variant-numeric:tabular-nums;color:#ffffff8f}.gallery-counter{padding:.0625rem .5rem;border-radius:9999px;background:#ffffff14;font-weight:600;color:#ffffffeb}.gallery-actions{display:flex;flex:none;align-items:center;gap:.5rem}.gallery-actions-divider{width:1px;height:1.25rem;margin:0 .25rem;background:#ffffff1f}.gallery-button,.gallery-nav{display:inline-flex;align-items:center;justify-content:center;padding:0;border:none;color:#ffffffeb;background:#ffffff14;cursor:pointer;transition:background-color .15s ease,color .15s ease,opacity .15s ease}.gallery-button:hover:not(:disabled),.gallery-nav:hover:not(:disabled){background:#ffffff29;color:#fff}.gallery-button:focus,.gallery-nav:focus{outline:none}.gallery-button:focus-visible,.gallery-nav:focus-visible{box-shadow:0 0 0 2px var(--color-primary-400)}.gallery-button nb-icon,.gallery-nav nb-icon{color:inherit}.gallery-button{width:2.25rem;height:2.25rem;border-radius:var(--border-radius)}.gallery-button nb-icon{width:1.125rem;height:1.125rem;font-size:1.125rem}.gallery-button.close:hover{background:#ff3d7133;color:var(--color-danger-400)}.gallery-content{position:relative;min-height:0}.media-viewer{position:absolute;inset:1.5rem 5.75rem;display:flex;align-items:center;justify-content:center}.media-frame{display:contents}.media{display:block;max-width:100%;max-height:100%;object-fit:contain;border-radius:var(--border-radius);box-shadow:0 1.5rem 4rem #0009}.media-frame.not-work-related .media{outline:2px solid var(--color-danger-500);outline-offset:.25rem}.media-frame:has(.media.default-image){display:flex;align-items:center;justify-content:center;width:min(48rem,100%);max-height:100%;aspect-ratio:16/10;border-radius:var(--border-radius);background:#ffffff0a}.media-frame:has(.media.default-image).not-work-related{outline:2px solid var(--color-danger-500);outline-offset:.25rem}.media-frame:has(.media.default-image) .media{width:10rem;height:10rem;outline:none;box-shadow:none;opacity:.35!important}.gallery-nav{position:absolute;top:50%;z-index:1;width:2.75rem;height:2.75rem;border-radius:50%;transform:translateY(-50%)}.gallery-nav.previous{left:1.5rem}.gallery-nav.next{right:1.5rem}.gallery-nav nb-icon{width:1.5rem;height:1.5rem;font-size:1.5rem}.gallery-nav:disabled{opacity:.25;cursor:default}.gallery-footer{border-top:1px solid rgba(255,255,255,.08);background:#0006}.thumb-items{display:flex;gap:.625rem;padding:.875rem 1.5rem;overflow-x:auto;overflow-y:hidden}.thumb-item{display:flex;flex:none;flex-direction:column;align-items:center;gap:.375rem;padding:0;border:none;background:none;color:#ffffff8f;cursor:pointer}.thumb-item:first-child{margin-inline-start:auto}.thumb-item:last-child{margin-inline-end:auto}.thumb-item:focus{outline:none}.thumb-item:focus-visible .thumb-frame{box-shadow:0 0 0 2px var(--color-primary-400)}.thumb-frame{display:block;width:7.5rem;height:4.6875rem;overflow:hidden;border:2px solid transparent;border-radius:var(--border-radius);background:#ffffff0a}.thumb-frame img{display:block;width:100%;height:100%;object-fit:cover;opacity:.5!important;transition:opacity .15s ease}.thumb-frame img.default-image{box-sizing:border-box;padding:1.375rem;object-fit:contain;opacity:.25!important}.thumb-time{font-size:11px;line-height:1rem;font-variant-numeric:tabular-nums}.thumb-item:hover .thumb-frame img{opacity:.85!important}.thumb-item:hover .thumb-frame img.default-image{opacity:.35!important}.thumb-item.not-work-related .thumb-frame{border-color:var(--color-danger-500)}.thumb-item.thumb-item-active{color:#ffffffeb}.thumb-item.thumb-item-active .thumb-frame{outline:2px solid var(--color-primary-500);outline-offset:2px}.thumb-item.thumb-item-active .thumb-frame img{opacity:1!important}.thumb-item.thumb-item-active .thumb-frame img.default-image{opacity:.5!important}.thumb-item.thumb-item-active .thumb-time{font-weight:600}@media(prefers-reduced-motion:reduce){.gallery-button,.gallery-nav,.thumb-frame img{transition:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i4.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }, { kind: "pipe", type: i6.DateFormatPipe, name: "dateFormat" }, { kind: "pipe", type: i7.TimeFormatPipe, name: "timeFormat" }, { kind: "pipe", type: i8.UtcToTimezone, name: "utcToTimezone" }, { kind: "pipe", type: i9.TranslatePipe, name: "translate" }], animations: [fadeInOutAnimation] }); }
};
GalleryComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        GalleryService,
        TimeZoneService])
], GalleryComponent);
export { GalleryComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery', animations: [fadeInOutAnimation], standalone: false, template: "<div class=\"gallery-inner\" tabindex=\"-1\" #galleryInner [@fadeInOut]>\n\t@let recordedTime = item?.recordedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async);\n\t<!-- When the active screenshot was taken, its place in the set, and the actions. -->\n\t<header class=\"gallery-header\">\n\t\t<!-- Product images (Inventory) carry no recorded time; only the counter shows. -->\n\t\t<div class=\"gallery-heading\">\n\t\t\t@if (item?.recordedAt) {\n\t\t\t<span class=\"gallery-title\">\n\t\t\t\t{{ item?.recordedAt | utcToTimezone : (timeZone$ | async) | dateFormat }}\n\t\t\t</span>\n\t\t\t}\n\t\t\t<span class=\"gallery-subtitle\">\n\t\t\t\t@if (item?.recordedAt) {\n\t\t\t\t{{ recordedTime }}\n\t\t\t\t}\n\t\t\t\t@if (active_index >= 0 && items.length > 0) {\n\t\t\t\t<span class=\"gallery-counter\">{{ active_index + 1 }} / {{ items.length }}</span>\n\t\t\t\t}\n\t\t\t</span>\n\t\t</div>\n\t\t<div class=\"gallery-actions\">\n\t\t\t@if (item?.description) {\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gallery-button\"\n\t\t\t\t[nbTooltip]=\"item?.description\"\n\t\t\t\t[attr.aria-label]=\"'REPORT_PAGE.DESCRIPTION' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t}\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gallery-button\"\n\t\t\t\t(click)=\"downloadFile(item?.fullUrl)\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.DOWNLOAD' | translate\"\n\t\t\t\t[attr.aria-label]=\"'BUTTONS.DOWNLOAD' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t</button>\n\t\t\t<span class=\"gallery-actions-divider\"></span>\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gallery-button close\"\n\t\t\t\t(click)=\"close()\"\n\t\t\t\t[nbTooltip]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</header>\n\n\t<!-- A click on the dark stage around the screenshot closes the viewer. -->\n\t<div class=\"gallery-content\" (click)=\"close()\">\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"gallery-nav previous\"\n\t\t\t[disabled]=\"active_index == 0\"\n\t\t\t(click)=\"previous($event)\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.PREVIOUS' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t</button>\n\t\t<div class=\"media-viewer\">\n\t\t\t<!-- A new <img> per screenshot, not one whose src changes: the shared img\n\t\t\t     directive swaps in the fallback picture only for an element's first\n\t\t\t     failed load, so the next broken screenshot showed a 16px broken icon. -->\n\t\t\t@for (media of [item]; track media?.id) {\n\t\t\t<!-- The frame carries the work-related ring, so dimming the placeholder\n\t\t\t     picture inside it does not dim the ring too. -->\n\t\t\t<div\n\t\t\t\tclass=\"media-frame\"\n\t\t\t\t[class.not-work-related]=\"media?.isWorkRelated === false\"\n\t\t\t\t(click)=\"$event.stopPropagation()\"\n\t\t\t>\n\t\t\t\t<img\n\t\t\t\t\tclass=\"media\"\n\t\t\t\t\tdraggable=\"false\"\n\t\t\t\t\t[src]=\"media?.fullUrl\"\n\t\t\t\t\t[alt]=\"media?.description || ((media?.recordedAt ? 'TIMESHEET.SCREENSHOTS.TAKEN_AT' : 'TIMESHEET.SCREENSHOTS.POSITION') | translate : { time: recordedTime, position: active_index + 1, total: items.length })\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t\t<button\n\t\t\ttype=\"button\"\n\t\t\tclass=\"gallery-nav next\"\n\t\t\t[disabled]=\"active_index == items.length - 1\"\n\t\t\t(click)=\"next($event)\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.NEXT' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t</button>\n\t</div>\n\n\t<footer class=\"gallery-footer\">\n\t\t<div class=\"thumb-items custom-scroll\" #customScroll>\n\t\t\t@for (thumb of items; track trackByThumbId(index, thumb); let index = $index) {\n\t\t\t@let thumbTime = thumb?.recordedAt | utcToTimezone : (timeZone$ | async) | timeFormat : (timeFormat$ | async) : false;\n\t\t\t<!-- Named by its place in the set, which stays unique when there is no time. -->\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"thumb-item\"\n\t\t\t\t[class.thumb-item-active]=\"item?.id === thumb?.id\"\n\t\t\t\t[class.not-work-related]=\"thumb?.isWorkRelated === false\"\n\t\t\t\t[attr.aria-pressed]=\"item?.id === thumb?.id\"\n\t\t\t\t[attr.aria-label]=\"('TIMESHEET.SCREENSHOTS.POSITION' | translate : { position: index + 1, total: items.length }) + (thumb?.recordedAt ? ', ' + thumbTime : '')\"\n\t\t\t\t(click)=\"setFocus(thumb)\"\n\t\t\t>\n\t\t\t\t<span class=\"thumb-frame\">\n\t\t\t\t\t@if (thumb) {\n\t\t\t\t\t<img draggable=\"false\" [src]=\"thumb?.thumbUrl\" alt=\"\" />\n\t\t\t\t\t}\n\t\t\t\t</span>\n\t\t\t\t@if (thumb?.recordedAt) {\n\t\t\t\t<span class=\"thumb-time\">{{ thumbTime }}</span>\n\t\t\t\t}\n\t\t\t</button>\n\t\t\t}\n\t\t</div>\n\t</footer>\n</div>\n", styles: [":host{display:block;height:100%}.gallery-inner{display:grid;grid-template-rows:auto minmax(0,1fr) auto;height:100%;background-color:#000000e6;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);color:#ffffffeb}.gallery-inner:focus{outline:none}.gallery-header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.75rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.08)}.gallery-heading{display:flex;flex-direction:column;gap:.25rem;min-width:0}.gallery-title{font-size:14px;font-weight:600;line-height:1.25rem;color:#ffffffeb}.gallery-subtitle{display:flex;align-items:center;gap:.625rem;font-size:12px;line-height:1rem;font-variant-numeric:tabular-nums;color:#ffffff8f}.gallery-counter{padding:.0625rem .5rem;border-radius:9999px;background:#ffffff14;font-weight:600;color:#ffffffeb}.gallery-actions{display:flex;flex:none;align-items:center;gap:.5rem}.gallery-actions-divider{width:1px;height:1.25rem;margin:0 .25rem;background:#ffffff1f}.gallery-button,.gallery-nav{display:inline-flex;align-items:center;justify-content:center;padding:0;border:none;color:#ffffffeb;background:#ffffff14;cursor:pointer;transition:background-color .15s ease,color .15s ease,opacity .15s ease}.gallery-button:hover:not(:disabled),.gallery-nav:hover:not(:disabled){background:#ffffff29;color:#fff}.gallery-button:focus,.gallery-nav:focus{outline:none}.gallery-button:focus-visible,.gallery-nav:focus-visible{box-shadow:0 0 0 2px var(--color-primary-400)}.gallery-button nb-icon,.gallery-nav nb-icon{color:inherit}.gallery-button{width:2.25rem;height:2.25rem;border-radius:var(--border-radius)}.gallery-button nb-icon{width:1.125rem;height:1.125rem;font-size:1.125rem}.gallery-button.close:hover{background:#ff3d7133;color:var(--color-danger-400)}.gallery-content{position:relative;min-height:0}.media-viewer{position:absolute;inset:1.5rem 5.75rem;display:flex;align-items:center;justify-content:center}.media-frame{display:contents}.media{display:block;max-width:100%;max-height:100%;object-fit:contain;border-radius:var(--border-radius);box-shadow:0 1.5rem 4rem #0009}.media-frame.not-work-related .media{outline:2px solid var(--color-danger-500);outline-offset:.25rem}.media-frame:has(.media.default-image){display:flex;align-items:center;justify-content:center;width:min(48rem,100%);max-height:100%;aspect-ratio:16/10;border-radius:var(--border-radius);background:#ffffff0a}.media-frame:has(.media.default-image).not-work-related{outline:2px solid var(--color-danger-500);outline-offset:.25rem}.media-frame:has(.media.default-image) .media{width:10rem;height:10rem;outline:none;box-shadow:none;opacity:.35!important}.gallery-nav{position:absolute;top:50%;z-index:1;width:2.75rem;height:2.75rem;border-radius:50%;transform:translateY(-50%)}.gallery-nav.previous{left:1.5rem}.gallery-nav.next{right:1.5rem}.gallery-nav nb-icon{width:1.5rem;height:1.5rem;font-size:1.5rem}.gallery-nav:disabled{opacity:.25;cursor:default}.gallery-footer{border-top:1px solid rgba(255,255,255,.08);background:#0006}.thumb-items{display:flex;gap:.625rem;padding:.875rem 1.5rem;overflow-x:auto;overflow-y:hidden}.thumb-item{display:flex;flex:none;flex-direction:column;align-items:center;gap:.375rem;padding:0;border:none;background:none;color:#ffffff8f;cursor:pointer}.thumb-item:first-child{margin-inline-start:auto}.thumb-item:last-child{margin-inline-end:auto}.thumb-item:focus{outline:none}.thumb-item:focus-visible .thumb-frame{box-shadow:0 0 0 2px var(--color-primary-400)}.thumb-frame{display:block;width:7.5rem;height:4.6875rem;overflow:hidden;border:2px solid transparent;border-radius:var(--border-radius);background:#ffffff0a}.thumb-frame img{display:block;width:100%;height:100%;object-fit:cover;opacity:.5!important;transition:opacity .15s ease}.thumb-frame img.default-image{box-sizing:border-box;padding:1.375rem;object-fit:contain;opacity:.25!important}.thumb-time{font-size:11px;line-height:1rem;font-variant-numeric:tabular-nums}.thumb-item:hover .thumb-frame img{opacity:.85!important}.thumb-item:hover .thumb-frame img.default-image{opacity:.35!important}.thumb-item.not-work-related .thumb-frame{border-color:var(--color-danger-500)}.thumb-item.thumb-item-active{color:#ffffffeb}.thumb-item.thumb-item-active .thumb-frame{outline:2px solid var(--color-primary-500);outline-offset:2px}.thumb-item.thumb-item-active .thumb-frame img{opacity:1!important}.thumb-item.thumb-item-active .thumb-frame img.default-image{opacity:.5!important}.thumb-item.thumb-item-active .thumb-time{font-weight:600}@media(prefers-reduced-motion:reduce){.gallery-button,.gallery-nav,.thumb-frame img{transition:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.GalleryService }, { type: i3.TimeZoneService }], propDecorators: { item: [{
                type: Input
            }], employeeId: [{
                type: Input
            }], customScroll: [{
                type: ViewChild,
                args: ['customScroll', { static: true }]
            }], galleryInner: [{
                type: ViewChild,
                args: ['galleryInner', { static: true }]
            }], onKeydown: [{
                type: HostListener,
                args: ['document:keydown', ['$event']]
            }] } });
//# sourceMappingURL=gallery.component.js.map