import { OnInit } from '@angular/core';
import { PostHogServiceManager } from '../services/posthog-manager.service';
import * as i0 from "@angular/core";
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
export declare class PostHogTrackDirective implements OnInit {
    private posthogServiceManager;
    eventName: string;
    properties: Record<string, unknown>;
    captureOnInit: boolean;
    eventType: string;
    stopPropagation: boolean;
    constructor(posthogServiceManager: PostHogServiceManager);
    ngOnInit(): void;
    handleClick(event: Event): void;
    handleMouseEnter(event: Event): void;
    handleFocus(event: Event): void;
    private capture;
    static ɵfac: i0.ɵɵFactoryDeclaration<PostHogTrackDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PostHogTrackDirective, "[phTrack]", never, { "eventName": { "alias": "phTrack"; "required": false; }; "properties": { "alias": "phProperties"; "required": false; }; "captureOnInit": { "alias": "phOnInit"; "required": false; }; "eventType": { "alias": "phEventType"; "required": false; }; "stopPropagation": { "alias": "phStopPropagation"; "required": false; }; }, {}, never, never, true, never>;
}
