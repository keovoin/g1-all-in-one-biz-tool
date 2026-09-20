import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { debounceTime, Subject, tap } from 'rxjs';
import * as i0 from "@angular/core";
export class DebounceClickDirective {
    constructor() {
        this.clicks = new Subject();
        this.debounceTime = 300;
        this.throttledClick = new EventEmitter();
    }
    /**
     * Handles the click event and emits it after a debounce time.
     *
     * @param {Event} event - The click event object.
     * @return {void} This function does not return a value.
     */
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
    ngOnInit() {
        this.subscription = this.clicks
            .pipe(debounceTime(this.debounceTime), tap((e) => this.throttledClick.emit(e)))
            .subscribe();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DebounceClickDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: DebounceClickDirective, isStandalone: true, selector: "[debounceClick]", inputs: { debounceTime: "debounceTime" }, outputs: { throttledClick: "throttledClick" }, host: { listeners: { "click": "clickEvent($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DebounceClickDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[debounceClick]',
                    standalone: true
                }]
        }], propDecorators: { debounceTime: [{
                type: Input
            }], throttledClick: [{
                type: Output
            }], clickEvent: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=debounce-click.directive.js.map