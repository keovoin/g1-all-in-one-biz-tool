import { Directive, Input, ElementRef, Renderer2, HostListener, Inject, Optional } from '@angular/core';
import { PostHogServiceManager } from '../services/posthog-manager.service';
import { POSTHOG_DEBUG_MODE } from '../interfaces/posthog.interface';
import { NgForm } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "../services/posthog-manager.service";
import * as i2 from "@angular/forms";
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
export class PostHogFormTrackDirective {
    constructor(posthogServiceManager, elementRef, renderer, ngForm, debugMode = false) {
        this.posthogServiceManager = posthogServiceManager;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.ngForm = ngForm;
        this.debugMode = debugMode;
        this.phFormName = 'form';
        this.phTrackFields = false;
        this.phExcludeFields = ['password', 'secret', 'token', 'credit', 'card'];
        this.phSanitizeValues = true;
        this.phTrackFocus = false;
        this.phTrackBlur = false;
        this.phTrackChange = true;
        this.phIncludeMetadata = true;
        this.phFieldPrefix = ''; // Prefix for tracking field interactions
        // Field interaction listeners
        this.fieldListeners = [];
    }
    ngOnInit() {
        // Setup field tracking if enabled
        if (this.phTrackFields) {
            this.setupFieldTracking();
        }
        // Track form viewed event
        try {
            this.posthogServiceManager.trackEvent(`form_viewed`, {
                form_name: this.phFormName,
                form_id: this.elementRef.nativeElement.id || undefined,
                form_action: this.elementRef.nativeElement.action || undefined,
                form_fields: this.getFieldNames()
            });
        }
        catch (err) {
            if (this.debugMode) {
                console.warn('[PostHog] Skipped form_viewed event – service not ready', err);
            }
        }
    }
    onSubmit(event) {
        const formData = this.getFormData();
        this.posthogServiceManager.trackEvent(`form_submitted`, {
            form_name: this.phFormName,
            form_id: this.elementRef.nativeElement.id || undefined,
            form_action: this.elementRef.nativeElement.action || undefined,
            form_valid: this.ngForm?.valid ?? this.elementRef.nativeElement.checkValidity?.() ?? true,
            ...formData
        });
        if (this.debugMode) {
            console.debug(`[PostHog] Form submitted: ${this.phFormName}`, formData);
        }
    }
    ngOnDestroy() {
        // Cleanup all event listeners
        this.fieldListeners.forEach((removeListener) => removeListener());
    }
    /**
     * Setup tracking for individual form fields
     */
    setupFieldTracking() {
        const formElement = this.elementRef.nativeElement;
        const fields = Array.from(formElement.elements);
        fields.forEach((field) => {
            if (!(field instanceof HTMLInputElement ||
                field instanceof HTMLSelectElement ||
                field instanceof HTMLTextAreaElement)) {
                return;
            }
            const fieldName = field.name;
            if (!fieldName || this.shouldExcludeField(fieldName))
                return;
            // Track focus events
            if (this.phTrackFocus) {
                const focusListener = this.renderer.listen(field, 'focus', () => {
                    this.trackFieldInteraction('field_focus', field);
                });
                this.fieldListeners.push(focusListener);
            }
            // Track blur events
            if (this.phTrackBlur) {
                const blurListener = this.renderer.listen(field, 'blur', () => {
                    this.trackFieldInteraction('field_blur', field);
                });
                this.fieldListeners.push(blurListener);
            }
            // Track change events
            if (this.phTrackChange) {
                const changeListener = this.renderer.listen(field, 'change', () => {
                    this.trackFieldInteraction('field_change', field);
                });
                this.fieldListeners.push(changeListener);
            }
        });
    }
    /**
     * Track a field interaction
     */
    trackFieldInteraction(eventType, field) {
        if (!(field instanceof HTMLInputElement ||
            field instanceof HTMLSelectElement ||
            field instanceof HTMLTextAreaElement)) {
            return;
        }
        const fieldName = field.name;
        if (this.shouldExcludeField(fieldName))
            return;
        const eventName = this.phFieldPrefix ? `${this.phFieldPrefix}_${eventType}` : eventType;
        let value = undefined;
        // Only include value for certain field types and if sanitization is allowed
        if (!this.shouldRedactFieldValue(fieldName, field.type)) {
            if (field instanceof HTMLInputElement && field.type === 'checkbox') {
                value = field.checked;
            }
            else if (field instanceof HTMLInputElement && field.type === 'radio') {
                if (field.checked) {
                    value = field.value;
                }
            }
            else if (field instanceof HTMLSelectElement && field.multiple) {
                value = Array.from(field.selectedOptions).map((option) => option.value);
            }
            else {
                value = this.sanitizeFieldValue(field.value);
            }
        }
        const properties = {
            form_name: this.phFormName,
            field_name: fieldName,
            field_type: field.type
        };
        // Only add value if it exists and should be included
        if (value !== undefined) {
            properties['field_value'] = value;
        }
        // Add metadata if configured
        if (this.phIncludeMetadata) {
            properties['field_id'] = field.id || undefined;
            properties['field_required'] = field.required || false;
            if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
                properties['field_max_length'] = field.maxLength > 0 ? field.maxLength : undefined;
            }
        }
        this.posthogServiceManager.trackEvent(eventName, properties);
    }
    /**
     * Get all form data, sanitizing sensitive fields
     */
    getFormData() {
        const formData = {};
        const formElement = this.elementRef.nativeElement;
        const formFields = Array.from(formElement.elements);
        formFields.forEach((field) => {
            if (!(field instanceof HTMLInputElement ||
                field instanceof HTMLSelectElement ||
                field instanceof HTMLTextAreaElement)) {
                return;
            }
            const fieldName = field.name;
            if (!fieldName)
                return;
            if (this.shouldExcludeField(fieldName)) {
                formData[`field_${fieldName}_included`] = false;
                return;
            }
            if (field instanceof HTMLInputElement && field.type === 'checkbox') {
                formData[`field_${fieldName}`] = field.checked;
            }
            else if (field instanceof HTMLInputElement && field.type === 'radio') {
                if (field.checked) {
                    formData[`field_${fieldName}`] = field.value;
                }
            }
            else if (field instanceof HTMLSelectElement && field.multiple) {
                formData[`field_${fieldName}`] = Array.from(field.selectedOptions).map((option) => option.value);
            }
            else if (this.shouldRedactFieldValue(fieldName, field.type)) {
                formData[`field_${fieldName}`] = '[REDACTED]';
            }
            else {
                formData[`field_${fieldName}`] = this.sanitizeFieldValue(field.value);
            }
        });
        return formData;
    }
    /**
     * Get an array of field names in the form
     */
    getFieldNames() {
        const formElement = this.elementRef.nativeElement;
        const formFields = Array.from(formElement.elements);
        const fieldNames = [];
        formFields.forEach((field) => {
            if (!(field instanceof HTMLInputElement ||
                field instanceof HTMLSelectElement ||
                field instanceof HTMLTextAreaElement)) {
                return;
            }
            const fieldName = field.name;
            if (fieldName) {
                fieldNames.push(fieldName);
            }
        });
        return fieldNames;
    }
    /**
     * Check if a field should be excluded from tracking
     */
    shouldExcludeField(fieldName) {
        return this.phExcludeFields.some((pattern) => {
            if (typeof pattern === 'object' && pattern instanceof RegExp) {
                return pattern.test(fieldName);
            }
            if (typeof pattern === 'string') {
                return fieldName.toLowerCase().includes(pattern.toLowerCase());
            }
            return false;
        });
    }
    /**
     * Check if a field value should be redacted
     */
    shouldRedactFieldValue(fieldName, fieldType) {
        // Always redact password fields
        if (fieldType === 'password')
            return true;
        // Check field name against sensitive patterns
        const sensitivePatterns = [
            'password',
            'secret',
            'token',
            'auth',
            'key',
            'credit',
            'card',
            'cvv',
            'ssn',
            'social'
        ];
        return sensitivePatterns.some((pattern) => fieldName.toLowerCase().includes(pattern));
    }
    /**
     * Sanitize a field value for tracking
     */
    sanitizeFieldValue(value) {
        if (!this.phSanitizeValues)
            return value;
        // Truncate long values
        if (value && value.length > 100) {
            return `${value.substring(0, 97)}...`;
        }
        return value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogFormTrackDirective, deps: [{ token: i1.PostHogServiceManager }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i2.NgForm, optional: true }, { token: POSTHOG_DEBUG_MODE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: PostHogFormTrackDirective, isStandalone: true, selector: "form[phFormTrack]", inputs: { phFormName: "phFormName", phTrackFields: "phTrackFields", phExcludeFields: "phExcludeFields", phSanitizeValues: "phSanitizeValues", phTrackFocus: "phTrackFocus", phTrackBlur: "phTrackBlur", phTrackChange: "phTrackChange", phIncludeMetadata: "phIncludeMetadata", phFieldPrefix: "phFieldPrefix" }, host: { listeners: { "submit": "onSubmit($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogFormTrackDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'form[phFormTrack]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i1.PostHogServiceManager }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POSTHOG_DEBUG_MODE]
                }] }], propDecorators: { phFormName: [{
                type: Input
            }], phTrackFields: [{
                type: Input
            }], phExcludeFields: [{
                type: Input
            }], phSanitizeValues: [{
                type: Input
            }], phTrackFocus: [{
                type: Input
            }], phTrackBlur: [{
                type: Input
            }], phTrackChange: [{
                type: Input
            }], phIncludeMetadata: [{
                type: Input
            }], phFieldPrefix: [{
                type: Input
            }], onSubmit: [{
                type: HostListener,
                args: ['submit', ['$event']]
            }] } });
//# sourceMappingURL=posthog-form-track.directive.js.map