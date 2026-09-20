import { Directive, ElementRef, NgZone, Renderer2, inject } from '@angular/core';
import { asapScheduler } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Alterates autocomplete="off" attribute on chrome because it's ignoring it in case of credentials, address or credit card data type.
 */
export class AutocompleteOffDirective {
    constructor() {
        this._renderer = inject(Renderer2);
        this._el = inject(ElementRef);
        this._zone = inject(NgZone);
    }
    ngOnInit() {
        this._zone.runOutsideAngular(() => {
            if (this._el.nativeElement && this._el.nativeElement.hasAttribute('autocomplete-off')) {
                /**
                 * disabled autocomplete for form
                 */
                asapScheduler.schedule(() => this._el.nativeElement.setAttribute('autocomplete', 'off'));
                /**
                 * disabled autocomplete for all inputs inside form
                 */
                const inputs = Array.prototype.slice.call(this._el.nativeElement.querySelectorAll('input'));
                inputs.forEach((element) => {
                    this._renderer.setAttribute(element, 'autocomplete', 'off');
                    this._renderer.setAttribute(element, 'autocorrect', 'off');
                    this._renderer.setAttribute(element, 'autocapitalize', 'none');
                    this._renderer.setAttribute(element, 'spellcheck', 'false');
                });
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AutocompleteOffDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: AutocompleteOffDirective, isStandalone: true, selector: "[autocomplete-off]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AutocompleteOffDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[autocomplete-off]',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=autocomplete-off.directive.js.map