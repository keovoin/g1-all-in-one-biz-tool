import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import * as i0 from "@angular/core";
export class TriggerParentClickDirective {
    constructor() {
        this.el = inject(ElementRef);
    }
    onClick(event) {
        // Get the parent element
        const parent = this.el.nativeElement.parentElement;
        // Trigger the click event on the parent element
        if (parent) {
            const parentClickEvent = new MouseEvent('click', { bubbles: false, cancelable: true });
            parent.dispatchEvent(parentClickEvent);
        }
        // Stop the event from propagating to prevent any other handlers
        event.stopPropagation();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TriggerParentClickDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: TriggerParentClickDirective, isStandalone: true, selector: "[triggerParentClick]", host: { listeners: { "click": "onClick($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TriggerParentClickDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[triggerParentClick]',
                    standalone: true
                }]
        }], propDecorators: { onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=trigger-parent-click.directive.js.map