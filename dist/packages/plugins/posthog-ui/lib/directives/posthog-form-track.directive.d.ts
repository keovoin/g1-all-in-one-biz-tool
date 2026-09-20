import { OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { PostHogServiceManager } from '../services/posthog-manager.service';
import { NgForm } from '@angular/forms';
import * as i0 from "@angular/core";
/**
 * Directive to automatically track form submissions and field interactions with PostHog
 *
 * Usage:
 * <form
 *   phFormTrack
 *   [phFormName]="'signup_form'"
 *   [phTrackFields]="true"
 *   [phExcludeFields]="['password', 'credit-card']"
 *   [phSanitizeValues]="true"
 *   (ngSubmit)="onSubmit()"
 * >
 *   <input name="email" type="email">
 *   <input name="password" type="password">
 *   <button type="submit">Submit</button>
 * </form>
 */
export declare class PostHogFormTrackDirective implements OnInit, OnDestroy {
    private posthogServiceManager;
    private elementRef;
    private renderer;
    private ngForm?;
    private debugMode;
    phFormName: string;
    phTrackFields: boolean;
    phExcludeFields: (string | RegExp)[];
    phSanitizeValues: boolean;
    phTrackFocus: boolean;
    phTrackBlur: boolean;
    phTrackChange: boolean;
    phIncludeMetadata: boolean;
    phFieldPrefix: string;
    private fieldListeners;
    constructor(posthogServiceManager: PostHogServiceManager, elementRef: ElementRef<HTMLFormElement>, renderer: Renderer2, ngForm?: NgForm | undefined, debugMode?: boolean);
    ngOnInit(): void;
    onSubmit(event: Event): void;
    ngOnDestroy(): void;
    /**
     * Setup tracking for individual form fields
     */
    private setupFieldTracking;
    /**
     * Track a field interaction
     */
    private trackFieldInteraction;
    /**
     * Get all form data, sanitizing sensitive fields
     */
    private getFormData;
    /**
     * Get an array of field names in the form
     */
    private getFieldNames;
    /**
     * Check if a field should be excluded from tracking
     */
    private shouldExcludeField;
    /**
     * Check if a field value should be redacted
     */
    private shouldRedactFieldValue;
    /**
     * Sanitize a field value for tracking
     */
    private sanitizeFieldValue;
    static ɵfac: i0.ɵɵFactoryDeclaration<PostHogFormTrackDirective, [null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PostHogFormTrackDirective, "form[phFormTrack]", never, { "phFormName": { "alias": "phFormName"; "required": false; }; "phTrackFields": { "alias": "phTrackFields"; "required": false; }; "phExcludeFields": { "alias": "phExcludeFields"; "required": false; }; "phSanitizeValues": { "alias": "phSanitizeValues"; "required": false; }; "phTrackFocus": { "alias": "phTrackFocus"; "required": false; }; "phTrackBlur": { "alias": "phTrackBlur"; "required": false; }; "phTrackChange": { "alias": "phTrackChange"; "required": false; }; "phIncludeMetadata": { "alias": "phIncludeMetadata"; "required": false; }; "phFieldPrefix": { "alias": "phFieldPrefix"; "required": false; }; }, {}, never, never, true, never>;
}
