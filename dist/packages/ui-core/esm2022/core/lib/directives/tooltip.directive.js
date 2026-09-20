import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, PLATFORM_ID, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class TooltipDirective {
    constructor() {
        this.el = inject(ElementRef);
        this.platformId = inject(PLATFORM_ID);
        this.popup = null;
    }
    /**
     * Handles the mouse enter event and creates a tooltip popup at the middle of the element.
     *
     * @return {void} This function does not return anything.
     */
    onMouseEnter() {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const x = rect.left + this.el.nativeElement.offsetWidth / 2;
        const y = rect.top + this.el.nativeElement.offsetHeight + 6;
        this.createTooltipPopup(x, y);
    }
    /**
     * Removes the tooltip popup if it exists when the mouse leaves the element.
     *
     * @return {void} This function does not return anything.
     */
    onMouseLeave() {
        this.removeTooltip();
    }
    /**
     * Removes the tooltip popup from the DOM and clears the reference.
     */
    removeTooltip() {
        if (this.popup) {
            this.popup.remove();
            this.popup = null;
        }
    }
    /**
     * Creates a tooltip popup at the specified coordinates.
     *
     * @param {number} x - The x-coordinate of the popup.
     * @param {number} y - The y-coordinate of the popup.
     */
    createTooltipPopup(x, y) {
        if (!isPlatformBrowser(this.platformId))
            return;
        this.removeTooltip();
        const popup = document.createElement('div');
        // Create icon element safely
        if (this.icon) {
            const iconElement = document.createElement('i');
            iconElement.className = this.icon;
            popup.appendChild(iconElement);
        }
        // Add text content safely (no HTML injection)
        const textNode = document.createTextNode(this.gaTooltip || '');
        popup.appendChild(textNode);
        popup.setAttribute('class', 'tooltip-container');
        popup.style.top = y.toString() + 'px';
        popup.style.left = x.toString() + 'px';
        document.body.appendChild(popup);
        this.popup = popup;
    }
    ngOnDestroy() {
        this.removeTooltip();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TooltipDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: TooltipDirective, isStandalone: true, selector: "[gaTooltip]", inputs: { gaTooltip: "gaTooltip", icon: "icon" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TooltipDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gaTooltip]',
                    standalone: true
                }]
        }], propDecorators: { gaTooltip: [{
                type: Input
            }], icon: [{
                type: Input
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=tooltip.directive.js.map