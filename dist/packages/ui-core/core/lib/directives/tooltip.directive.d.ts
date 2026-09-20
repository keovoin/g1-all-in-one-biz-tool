import { OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TooltipDirective implements OnDestroy {
    private readonly el;
    private readonly platformId;
    private popup;
    gaTooltip: string;
    icon: string;
    /**
     * Handles the mouse enter event and creates a tooltip popup at the middle of the element.
     *
     * @return {void} This function does not return anything.
     */
    onMouseEnter(): void;
    /**
     * Removes the tooltip popup if it exists when the mouse leaves the element.
     *
     * @return {void} This function does not return anything.
     */
    onMouseLeave(): void;
    /**
     * Removes the tooltip popup from the DOM and clears the reference.
     */
    private removeTooltip;
    /**
     * Creates a tooltip popup at the specified coordinates.
     *
     * @param {number} x - The x-coordinate of the popup.
     * @param {number} y - The y-coordinate of the popup.
     */
    private createTooltipPopup;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TooltipDirective, "[gaTooltip]", never, { "gaTooltip": { "alias": "gaTooltip"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; }, {}, never, never, true, never>;
}
