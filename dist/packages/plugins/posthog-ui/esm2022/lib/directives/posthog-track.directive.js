import { Directive, Input, HostListener } from '@angular/core';
import { PostHogServiceManager } from '../services/posthog-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../services/posthog-manager.service";
/**
 * Directive to automatically track user interactions with PostHog
 *
 * Usage:
 * <button
 *   [phTrack]="'button_clicked'"
 *   [phProperties]="{ buttonName: 'submit' }"
 *   [phOnInit]="true"
 *   [phEventType]="'click'"
 *   [phStopPropagation]="true"
 * >
 *   Submit
 * </button>
 */
export class PostHogTrackDirective {
    constructor(posthogServiceManager) {
        this.posthogServiceManager = posthogServiceManager;
        this.properties = {};
        this.captureOnInit = false;
        this.eventType = 'click'; // default to click
        this.stopPropagation = false;
    }
    ngOnInit() {
        if (this.captureOnInit && this.eventName) {
            this.capture();
        }
    }
    handleClick(event) {
        if (this.eventType === 'click') {
            this.capture(event);
        }
    }
    handleMouseEnter(event) {
        if (this.eventType === 'mouseenter') {
            this.capture(event);
        }
    }
    handleFocus(event) {
        if (this.eventType === 'focus') {
            this.capture(event);
        }
    }
    capture(event) {
        if (!this.eventName)
            return;
        if (this.stopPropagation && event) {
            event.stopPropagation();
        }
        this.posthogServiceManager.trackEvent(this.eventName, this.properties);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogTrackDirective, deps: [{ token: i1.PostHogServiceManager }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: PostHogTrackDirective, isStandalone: true, selector: "[phTrack]", inputs: { eventName: ["phTrack", "eventName"], properties: ["phProperties", "properties"], captureOnInit: ["phOnInit", "captureOnInit"], eventType: ["phEventType", "eventType"], stopPropagation: ["phStopPropagation", "stopPropagation"] }, host: { listeners: { "click": "handleClick($event)", "mouseenter": "handleMouseEnter($event)", "focus": "handleFocus($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogTrackDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[phTrack]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i1.PostHogServiceManager }], propDecorators: { eventName: [{
                type: Input,
                args: ['phTrack']
            }], properties: [{
                type: Input,
                args: ['phProperties']
            }], captureOnInit: [{
                type: Input,
                args: ['phOnInit']
            }], eventType: [{
                type: Input,
                args: ['phEventType']
            }], stopPropagation: [{
                type: Input,
                args: ['phStopPropagation']
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], handleMouseEnter: [{
                type: HostListener,
                args: ['mouseenter', ['$event']]
            }], handleFocus: [{
                type: HostListener,
                args: ['focus', ['$event']]
            }] } });
//# sourceMappingURL=posthog-track.directive.js.map