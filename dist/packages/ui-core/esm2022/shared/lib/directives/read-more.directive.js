import { Directive, Input, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export class ReadMoreDirective {
    constructor(el) {
        this.el = el;
        this.hideToggle = true;
        this.isCollapsed = true;
    }
    /**
     * @inheritDoc
     */
    ngAfterViewInit() {
        this.text = this.elementChange.innerHTML;
        this.toggleView();
        if (!this.hideToggle) {
            this.el.nativeElement.classList.remove('hidden');
        }
        else {
            this.el.nativeElement.classList.add('hidden');
        }
        this.el.nativeElement.addEventListener('click', (event) => {
            event.preventDefault();
            this.toggleView();
        });
    }
    /**
     * @inheritDoc
     */
    ngOnChanges() {
        if (this.text) {
            this.toggleView();
        }
    }
    /**
     * Toggle view - full text or not
     */
    toggleView() {
        if (this.text.length <= this.maxLength) {
            this.el.nativeElement.querySelector('.more').style.display = 'none';
            this.el.nativeElement.querySelector('.less').style.display = 'none';
            return;
        }
        this.determineView();
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
            this.el.nativeElement.querySelector('.more').style.display = 'none';
            this.el.nativeElement.querySelector('.less').style.display = 'inherit';
        }
        else {
            this.el.nativeElement.querySelector('.more').style.display = 'inherit';
            this.el.nativeElement.querySelector('.less').style.display = 'none';
        }
    }
    /**
     * Determine view
     */
    determineView() {
        const _elementChange = this.elementChange; //document.getElementById(this.elementChange.id);
        if (this.text.length <= this.maxLength) {
            this.currentText = this.text;
            _elementChange.innerHTML = this.currentText;
            this.isCollapsed = false;
            this.hideToggle = true;
            return;
        }
        this.hideToggle = false;
        if (this.isCollapsed === true) {
            this.currentText = this.text.substring(0, this.maxLength) + '...';
            _elementChange.innerHTML = this.currentText;
        }
        else if (this.isCollapsed === false) {
            this.currentText = this.text;
            _elementChange.innerHTML = this.currentText;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReadMoreDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: ReadMoreDirective, isStandalone: true, selector: "[readMore]", inputs: { maxLength: ["readMore-length", "maxLength"], elementChange: ["readMore-element", "elementChange"] }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReadMoreDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[readMore]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { maxLength: [{
                type: Input,
                args: ['readMore-length']
            }], elementChange: [{
                type: Input,
                args: ['readMore-element']
            }] } });
//# sourceMappingURL=read-more.directive.js.map