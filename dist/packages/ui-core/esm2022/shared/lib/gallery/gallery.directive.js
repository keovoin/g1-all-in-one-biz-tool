import { Directive, HostListener, Input, ElementRef, inject } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { sortBy } from 'underscore';
import { GalleryComponent } from './gallery.component';
import { GalleryService } from './gallery.service';
import * as i0 from "@angular/core";
export class GalleryDirective {
    constructor() {
        this.el = inject(ElementRef);
        this.nbDialogService = inject(NbDialogService);
        this.galleryService = inject(GalleryService);
        this.disableClick = false;
        // Inputs
        this.items = [];
    }
    // Input with Setter
    set disabled(value) {
        this.disableClick = value || false;
        if (this.disableClick) {
            this.el.nativeElement.classList.add('disabled');
        }
        else {
            this.el.nativeElement.classList.remove('disabled');
        }
    }
    /**
     * Host listener for click events
     */
    onClick() {
        // Check if clicking is disabled
        if (this.disableClick) {
            return;
        }
        // Deep copy the 'item' property
        let item = JSON.parse(JSON.stringify(this.item));
        // Extract the first item from the sorted array
        item = item instanceof Array ? item[0] : item;
        // Open a dialog (possibly a gallery) using NbDialogService
        this.nbDialogService.open(GalleryComponent, {
            context: {
                item,
                employeeId: this.employeeId
            },
            dialogClass: 'fullscreen',
            // The gallery focuses itself; see `GalleryComponent.ngAfterViewInit`.
            autoFocus: false
        });
    }
    ngOnInit() {
        // Check if 'item' is an array; if not, convert it to a single-element array
        const items = this.items instanceof Array ? this.items : [this.items];
        // Sort the 'item' array by 'createdAt'
        this.items = sortBy(items, 'recordedAt');
        // Append the sorted 'item' array to the gallery service
        this.galleryService.appendItems(this.items);
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: GalleryDirective, isStandalone: true, selector: "[ngxGallery]", inputs: { items: "items", item: "item", employeeId: "employeeId", disabled: "disabled" }, host: { listeners: { "click": "onClick()" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GalleryDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxGallery]',
                    standalone: true
                }]
        }], propDecorators: { items: [{
                type: Input
            }], item: [{
                type: Input
            }], employeeId: [{
                type: Input
            }], disabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', []]
            }] } });
//# sourceMappingURL=gallery.directive.js.map