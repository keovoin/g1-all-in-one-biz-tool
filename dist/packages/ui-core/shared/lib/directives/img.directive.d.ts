import { OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Type for image fallback types supported by the directive.
 */
export type ImageType = 'user' | 'default';
/**
 * Directive that handles image loading with fallback to default images.
 * Optimized for performance with lazy initialization and efficient DOM operations.
 */
export declare class ImgDirective implements OnDestroy, OnInit {
    private readonly el;
    private readonly renderer;
    type: ImageType;
    skipDefaultImage: boolean;
    enableFadeIn: boolean;
    private listeners;
    private originalSrc;
    private isImageLoaded;
    private needsFadeIn;
    private rafId?;
    /**
     * Normalizes the image source URL based on the environment.
     * Optimized with regex check for absolute URLs.
     */
    private normalizeSrc;
    /**
     * Checks if the image is already loaded (cached images).
     * This allows us to skip unnecessary event listener setup.
     */
    private isImageAlreadyLoaded;
    /**
     * Applies styles in a batched manner using requestAnimationFrame for better performance.
     */
    private applyStyles;
    /**
     * Initializes the directive by setting up the image source and event listeners.
     * Optimized to skip work if image is already loaded.
     */
    ngOnInit(): void;
    /**
     * Handles the error event when the image fails to load.
     * This is the only essential listener - we must handle errors.
     */
    private handleError;
    /**
     * Handles the load event when the image successfully loads.
     * Only needed for fade-in effect - could potentially be removed if fade-in isn't critical.
     */
    private handleLoad;
    /**
     * Cleans up all event listeners at once.
     */
    private cleanupListeners;
    /**
     * Cleans up all event listeners and pending animations when the directive is destroyed.
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImgDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ImgDirective, "img", never, { "type": { "alias": "type"; "required": false; }; "skipDefaultImage": { "alias": "skipDefaultImage"; "required": false; }; "enableFadeIn": { "alias": "enableFadeIn"; "required": false; }; }, {}, never, never, true, never>;
}
